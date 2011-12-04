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
            doc.parentsstring = doc.parents + "," + doc._id ;
            emit([doc.parents[parentarm], doc.parentsstring, doc.initdate], doc);
        }
    }
};