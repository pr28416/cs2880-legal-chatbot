from pydantic import BaseModel


class Section(BaseModel):
    article_title: str
    article_code: str
    section_code: str
    section_title: str
    paragraphs: list[str] | None
    chunk: str | None
    related_links: list[str] | None
    url: str | None
    embeddings: list[float] | None = None
