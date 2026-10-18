from fastapi import FastAPI
from rag_service.core.lifespan import lifespan
from rag_service.api.routes import router

app = FastAPI(lifespan=lifespan)

app.include_router(router, prefix="/api")
