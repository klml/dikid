function(doc) {
  var _doc =  JSON.parse(JSON.stringify(doc)); 
  if (doc.type == 'ticket') {
      _doc.hierarchy = 1 ;
      emit([_doc._id, _doc.initdate], _doc);
  }
    if (_doc.parents && _doc.state != 'archive' ) {
     for (parentarm in _doc.parents ) {
            for ( distance in _doc.parents ) {
                if ( _doc.parents[parentarm] == _doc.parents[distance] ) _doc.hierarchy = distance * 1 + 2
            };
            emit([_doc.parents[parentarm], _doc.parents + "," + _doc._id , _doc.initdate], _doc);
        }
    }
}