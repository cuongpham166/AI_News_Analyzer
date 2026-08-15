from dotenv import load_dotenv
import json
import psycopg
import os
import asyncio
from data_pipeline.utils.table_sql_files import get_getter_query,get_creation_query
from data_pipeline.nats.streams import ensure_stream, RAW_SUBJECT

load_dotenv()
getter_query_folder_path = os.getenv("SQL_GETTER_QUERY_FOLDER_PATH")
update_query_folder_path = os.getenv("SQL_UPDATE_QUERY_FOLDER_PATH")


class OutboxPublisher:
    def __init__(
        self,
        js,
        conn,
        batch_size: int = 100,
        poll_interval: float = 1.0,
    ):
        self.js = js
        self.conn = conn
        self.subject = RAW_SUBJECT
        self.batch_size = batch_size
        self.poll_interval = poll_interval

    def get_pending_events(self):
        try:
            sql_file = f"{getter_query_folder_path}get_outbox_pending_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql, (self.batch_size,))
                return cur.fetchall()
        except psycopg.Error:
            self.conn.rollback()
            raise

    def mark_published(self, event_id):
        try:
            sql_file = f"{update_query_folder_path}outbox_mark_published.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql, (event_id,))
                self.conn.commit()
        except psycopg.Error:
            self.conn.rollback()
            raise

    async def publish_event(self, event):
        try:
            print("EVENT:", event)
            print("EVENT KEYS:", event.keys())

            event_id = event["event_id"]
            payload = event["payload"]

            if isinstance(payload, str):
                payload = json.loads(payload)

            payload_bytes = json.dumps(payload).encode("utf-8")
            print(
                f"Publishing {event_id} "
                f"to {self.subject} "
                f"({len(payload_bytes)} bytes)"
            )

            ack = await self.js.publish(
                self.subject,
                payload_bytes,
                headers={
                    "Nats-Msg-Id": str(event_id),
                },
            )
            print(
                f"NATS publish successful: "
                f"stream={ack.stream}, seq={ack.seq}"
            )

            await asyncio.to_thread(
                self.mark_published,
                event_id,
            )

            return True
        except Exception as e:
            print(
                f"OUTBOX PUBLISH FAILED: {e!r}"
            )
            return False

    async def run(self):
        while True:
            try:
                events = await asyncio.to_thread(self.get_pending_events)

                if not events:
                    await asyncio.sleep(self.poll_interval)
                    continue

                for event in events:
                    await self.publish_event(event)

            except asyncio.CancelledError:
                #self.logger.info("Outbox publisher stopped")
                raise

            except Exception:
                #self.logger.exception("Outbox publisher loop failed")
                await asyncio.sleep(self.poll_interval)