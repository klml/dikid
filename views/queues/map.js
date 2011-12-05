function(doc) {
  if (doc.queues && doc.state != 'archive' ) {
     for (queue in doc.queues ) {
        emit([doc.queues[queue]], doc);
    }
  }
}