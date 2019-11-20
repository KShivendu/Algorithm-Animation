  var cy = cytoscape({

    container: document.getElementById('cy'), // container to render in

    boxSelectionEnabled: false,
    autounselectify: true,

    elements: { // list of graph elements to start with

      nodes: [
        {data: { id: 'a' ,text:"a" }},
        {data: { id: 'b' ,text:"b" }},
        {data: { id: 'c' ,text:"c" }},
        {data: { id: 'd' ,text:"d" }},
        {data: { id: 'e' ,text:"e"}},
        {data: { id: 'f' ,text:"f"}},
        {data: { id: 'g' ,text:"g"}},
      ],
      edges: [
        {data: { id: 'ab', source: 'a', target: 'b' }},

        {data: { id: 'ac', source: 'a', target: 'c' }},

        {data: { id: 'bd', source: 'b', target: 'd' }},

        {data: { id: 'be', source: 'b', target: 'e' }},

        {data: { id: 'cf', source: 'c', target: 'f' }},

        {data: { id: 'cg', source: 'c', target: 'g' }},
      ] 
    },
  
    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': '#666',
          'label': 'data(id)',
          'content': 'data(text)',
          "font-size": "12px",
          "text-valign": "center",
          "text-halign": "center",

          "background-color": "#555",
          "text-outline-color": "#555",
          "text-outline-width": "2px",
          "color": "#fff",
          "overlay-padding": "6px",
          "z-index": "10",

          "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
          "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
    
        
        }
      },
  
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
          // "curve-style": "haystack",

        }
      },


      {
        selector: '.highlighted',
        style: {
          'background-color': '#216b9c',
          'line-color': '#61bffc',
          'target-arrow-color': '#61bffc',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s'
        }
      },

      {
        "selector": "core",
        "style": {
          "selection-box-color": "#AAD8FF",
          "selection-box-border-color": "#8BB0D0",
          "selection-box-opacity": "0.5"
        }
      },

    

      
    ],
  
    layout: {
      name: 'cose', // breadthfirst
      rows: 3,
      directed: true,
      padding: 10,
    }
  
  });


  function runAlgo(){
    const algo  = document.querySelector("#algorithmUsed").value;
    if(algo === "BFS"){
      doBFS();
    }
    else if(algo === "DFS"){
      doDFS();
    }
    else if(algo === "MST"){
      doMST();
    }
    else{
      alert("Invalid option");
    }
  }

  function doBFS(){
    let startVertex = "#a";
    if (document.getElementById("startIndex").value != ""){
      startVertex =  "#"+document.getElementById("startIndex").value;
    }
    var bfs = cy.elements().bfs(startVertex, function () { }, true);

    var i = 0;
      var highlightNextEle = function () {
        if (i < bfs.path.length) {
          bfs.path[i].addClass('highlighted');
    
          i++;
          setTimeout(highlightNextEle, 500);
        }
      };
  
      highlightNextEle();
  }
  
  function doDFS(){
    let startVertex = "#a";
    if (document.getElementById("startIndex").value != ""){
      startVertex =  "#"+document.getElementById("startIndex").value;
    }
    var dfs = cy.elements().dfs(startVertex, function () { }, true);

    var i = 0;
      var highlightNextEle = function () {
        if (i < dfs.path.length) {
          dfs.path[i].addClass('highlighted');
    
          i++;
          setTimeout(highlightNextEle, 500);
        }
      };
  
      highlightNextEle();
  }
  
  function doMST(){
    let startVertex = "#a";
    if (document.getElementById("startIndex").value != ""){
      startVertex =  "#"+document.getElementById("startIndex").value;
    }
    var mst = cy.elements().kruskal(startVertex, function () { }, true);

    var i = 0;
      var highlightNextEle = function () {
        if (i < mst.path.length) {
          mst.path[i].addClass('highlighted');
    
          i++;
          setTimeout(highlightNextEle, 500);
        }
      };
  
      highlightNextEle();
  }


  

  function changeMatrix(N){
    console.log("N Value changed ",N);
    const table = document.querySelector('table.matrix');
    let htmlToInject = '';
    for(var i=0;i<N;i++){
      htmlToInject += `<tr>`
      for(var j =0;j<N;j++){
        htmlToInject += `<td><input type="checkbox" name="" id=""></td>`
      }
      htmlToInject += `</tr>`
    }
    // console.log(htmlToInject)
    table.innerHTML = htmlToInject;
  }


  function generateAdjList(N){
    const adjListElement = document.querySelector('div.adjList');
    let htmlToInject = '';
    for(let i=0;i<N;i++){
      htmlToInject += `
      <label for="vert_${i}">Vertex ${i}</label>
      <input type="text" name="vert_${i}" id="vert_${i}"><br>`;
    }
    htmlToInject += `<button id='submit' onclick="loadfromAdjList(${N})">Generate Graph</button>
    `;
    adjListElement.innerHTML = htmlToInject;
  }

  function loadfromAdjList(N){
    cy.elements().remove()
    const adjListElements = document.querySelector('div.adjList');

    // Add Nodes first
    console.log(adjListElements);
    var nodes = [];

    for(var i =0;i<N;i++){
      nodes.push({ group: 'nodes', data: { id: 'n'+i, text: "n"+i } })
    }

    cy.add(nodes)

    // Now Adding Edges

    let edges = [];
    adjListElements.querySelectorAll('input').forEach(vertexAdjList => {
      edgeFrom = vertexAdjList.id.split("_")[1];
      vertexAdjList.value.split(",").forEach(edgeTo => {
        if(edgeTo == ""){
          return;
        }
        console.log(`Create edge from ${edgeFrom} to ${edgeTo}`)
        edges.push({ group: 'edges', data: { id: `${edgeFrom}${edgeTo}`, source: `n${edgeFrom}`, target: `n${edgeTo}` } })
      })
    });

    cy.add(edges);

    // var layout = cy.elements().layout({
    //   name: 'cose', // breadthfirst
    //   rows: 3,
    //   directed: true,
    //   padding: 10,
    // })


    cy.resize()
    // replace eles


    // var eles = cy.add([
    //   { group: 'nodes', data: { id: 'n0', text: "n0" }, position: { x: 100, y: 100 } },
    //   { group: 'nodes', data: { id: 'n1', text: "n1" }, position: { x: 200, y: 200 } },
    //   { group: 'edges', data: { id: 'e0', source: 'n0', target: 'n1' } }
    // ]);

  }
   

