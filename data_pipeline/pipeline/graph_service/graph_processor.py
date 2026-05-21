from ai.responses.inference_response import InferenceResult

class GraphProcessor:
    def __init__(self,graph_repo):
        self.graph_repo = graph_repo

    def process_article(self, inference_result:InferenceResult):
        self.graph_repo.process_article(inference_result)