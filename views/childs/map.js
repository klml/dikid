function(doc) {
  if (doc.type == 'ticket') {
      //~ doc.hierarchy = 1 ;
      emit([doc._id, doc.initdate], doc);
  }
    if (doc.parents && doc.state != 'archive' ) {
     for (parentarm in doc.parents ) {
            //~ for ( distance in doc.parents ) {  // doesnt work on https://klml.cloudant.com/dikid/_design/dikid/_rewrite/bunch/alltickets
                //~ if ( doc.parents[parentarm] == doc.parents[distance] ) doc.hierarchy = distance * 1 + 2
            //~ };
            emit([doc.parents[parentarm], doc.parents + "," + doc._id , doc.initdate], doc);
        }
    }
}