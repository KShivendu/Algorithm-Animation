$(function () { // on dom ready

    var cy = cytoscape({
      container: document.getElementById('cy'),
  
      boxSelectionEnabled: false,
      autounselectify: true,
  
      style: cytoscape.stylesheet()
        .selector('node')
        .css({
          'content': 'data(text)'
        })
        .selector('edge')
        .css({
          'content': 'data(label)',
          'target-arrow-shape': 'triangle',
          'width': 4,
          'line-color': '#ddd',
          'target-arrow-color': '#ddd',
          'curve-style': 'bezier'
        })
        .selector('.highlighted')
        .css({
          'background-color': '#61bffc',
          'line-color': '#61bffc',
          'target-arrow-color': '#61bffc',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s'
        }),
  
      elements: {
        nodes: [
          { data: { id: 'a', text: 'Node A' } },
          { data: { id: 'b', text: 'Node B' } },
          { data: { id: 'c', text: 'Node C' } },
          { data: { id: 'd', text: 'Node D' } }
        ],
  
        edges: [
          { data: { id: 'ac', label: 'Edge AC', weight: 1, source: 'a', target: 'c' } },
          { data: { id: 'ac2', label: 'Edge AC2', weight: 1, source: 'a', target: 'c' } },
          { data: { id: 'bc', label: 'Edge BC', weight: 1, source: 'b', target: 'c' } },
          { data: { id: 'bc2', label: 'Edge BC2', weight: 1, source: 'b', target: 'c' } },
          { data: { id: 'dc', label: 'Edge DC', weight: 1, source: 'd', target: 'c' } },
          { data: { id: 'dc3', label: 'Edge DC3', weight: 1, source: 'd', target: 'c' } },
          { data: { id: 'ab', label: 'Edge AB', weight: 1, source: 'a', target: 'b' } },
          { data: { id: 'db', label: 'Edge DB', weight: 1, source: 'd', target: 'b' } }
  
        ]
      },
  
      layout: {
        name: 'breadthfirst',
        directed: true,
        roots: '#a',
        padding: 10
      }
    });
  
    var bfs = cy.elements().bfs('#a', function () { }, true);
  
    var i = 0;
    var highlightNextEle = function () {
      if (i < bfs.path.length) {
        bfs.path[i].addClass('highlighted');
  
        i++;
        setTimeout(highlightNextEle, 1000);
      }
    };
  
    // kick off first highlight
    highlightNextEle();
  
  }); // on dom ready