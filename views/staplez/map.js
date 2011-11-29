function(doc) {
  if (doc.type == 'ticket') {
      doc.hierarchy = 1 ;
      emit([doc._id, doc.initdate], doc);
  }
    if (doc.parents && doc.state != 'archive' ) {
     for (parentarm in doc.parents ) {
            for ( distance in doc.parents ) {
                if ( doc.parents[parentarm] == doc.parents[distance] ) doc.hierarchy = distance * 1 + 2
            };
            emit([doc.parents[parentarm], doc._id, doc.parents, doc.initdate], doc);
        }
    }
};