function(doc) {
  if (doc.parents) {
    for (parentarm in doc.parents ) {
        for (parent in doc.parents[parentarm] ) {  
            emit(doc.parents[parentarm][parent], doc);
        }
    }
  }
  if (doc.type == "ticket") {
      emit(doc._id, doc);
  }
};