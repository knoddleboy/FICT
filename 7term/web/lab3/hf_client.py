import requests


class HuggingFaceClient:
    def __init__(self, api_key: str, model: str = "gpt2") -> None:
        self.api_key = api_key
        self.model = model
        self.api_url = f"https://api-inference.huggingface.co/models/{self.model}"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
        }

    def query(self, prompt: str):
        """Sends a query to the Hugging Face model and returns the response."""
        data = {"inputs": prompt}
        response = requests.post(self.api_url, headers=self.headers, json=data)
        return response.json()

    def get_response_text(self, prompt: str):
        """Extracts and returns the response text from the Hugging Face model."""
        response_json = self.query(prompt)

        try:
            return response_json[0]["generated_text"].strip()
        except (KeyError, IndexError):
            return "Error: Could not retrieve valid response."
