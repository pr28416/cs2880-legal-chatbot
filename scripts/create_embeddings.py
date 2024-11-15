from utils import get_openai_client, create_supabase_client
import json
from models import Section
from tenacity import retry, wait_exponential, stop_after_attempt
from openai import RateLimitError
import multiprocessing as mp
from tqdm import tqdm
from openai.types.create_embedding_response import CreateEmbeddingResponse


def create_chunks(paragraphs: list[str], chunk_size: int = 1000) -> list[str]:
    all_text = "\n".join(paragraphs)
    return [all_text[i : i + chunk_size] for i in range(0, len(all_text), chunk_size)]


@retry(
    wait=wait_exponential(multiplier=1, min=4, max=60),
    stop=stop_after_attempt(5),
    retry=lambda e: isinstance(e, RateLimitError),
)
def create_embedding_for_section(section: Section):
    try:
        client = get_openai_client()
        response: CreateEmbeddingResponse = client.embeddings.create(
            input=section.chunk, model="text-embedding-3-small"
        )
        section.embeddings = response.data[0].embedding
        return section
    except Exception as e:
        print(e)
        return None


if __name__ == "__main__":
    with open("scripts/articles.json", "r") as f:
        raw_articles = json.load(f)

    sections: list[Section] = []

    for article in raw_articles:
        for section in article["sections"]:
            chunks = create_chunks(section["paragraphs"])
            for chunk in chunks:
                sections.append(
                    Section(
                        article_title=article["title"],
                        article_code=article["code"],
                        section_code=section["section"],
                        section_title=section["title"],
                        paragraphs=section["paragraphs"],
                        chunk=chunk,
                        related_links=section["related_links"],
                        url=article["url"],
                    )
                )

    with tqdm(total=len(sections)) as pbar:

        def update_pbar(result: Section | None):
            pbar.update(1)
            if result is None:
                return
            supabase = create_supabase_client()
            supabase.table("sections").upsert(result.model_dump(mode="json")).execute()

        with mp.Pool(processes=10) as pool:
            for section in sections:
                pool.apply_async(
                    create_embedding_for_section, args=(section,), callback=update_pbar
                )
            pool.close()
            pool.join()
