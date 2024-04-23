from app.database.base_repository import BaseRepository


def insert_one(document):
    repository = BaseRepository("facial_profile")
    result = repository.insert_one(document)
    repository.close_connection()
    return str(result)


def search_by_id(document_id):
    repository = BaseRepository("facial_profile")
    result = repository.search_by_id(document_id)
    repository.close_connection()
    return result
