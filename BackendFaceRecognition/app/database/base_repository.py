from pymongo import MongoClient
from bson.objectid import ObjectId

from ..server_config import ServerConfig

server_config = ServerConfig()


class BaseRepository:
    def __init__(self, collection_name):
        self.client = MongoClient(server_config.get_mongodb_uri())
        self.db = self.client[server_config.get_mongodb_database()]
        self.collection = self.db[collection_name]

    def insert_one(self, document):
        result = self.collection.insert_one(document)
        return result.inserted_id

    def search_by_id(self, document_id):
        obj_id = ObjectId(document_id)
        documento = self.collection.find_one({"_id": obj_id})
        return documento

    def close_connection(self):
        self.client.close()
