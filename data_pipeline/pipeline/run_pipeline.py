import asyncio

from data_pipeline.pipeline.ingestion_service.ingestion_producer import main as ingestion_main
from data_pipeline.pipeline.normalization_service.normalization_consumer import main as normalization_main
from data_pipeline.pipeline.inference_service.inference_consumer import main as inference_main
from data_pipeline.pipeline.article_service.article_consumer import main as article_main
from data_pipeline.pipeline.indexing_service.indexing_consumer import main as indexing_main
from data_pipeline.pipeline.graph_service.graph_consumer import main as graph_main
from data_pipeline.pipeline.inference_service.inference_processor import InferenceProcessor

async  def start_pipeline():
    print("Initializing all pipeline modules...")
    inference_processor = InferenceProcessor()

    await asyncio.gather(
        inference_main(inference_processor),
        ingestion_main(),
        normalization_main(),
        article_main(),
        indexing_main(),
        graph_main()
    )

if __name__ == "__main__":
    print("Starting Main Pipeline Orchestrator...")
    try:
        asyncio.run(start_pipeline())
    except KeyboardInterrupt:
        print("\n Pipeline stopped.")