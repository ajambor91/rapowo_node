exports.wsCollection = {
  collection: [],
  findSocket: (collection, id) => {
        const collectionLength = collection.length;
        for (let i = 0; i<= collectionLength - 1; i++){
            if(collection[i].userId === id){
                return collection[i].ws;
            }
        }
  }
};
