  var cy = cytoscape({

    container: document.getElementById('cy'), // container to render in

    boxSelectionEnabled: false,
    autounselectify: true,

    elements: { // list of graph elements to start with

      nodes: [
        {data: { id: '0' ,text:"n0" }}, // a
        {data: { id: '1' ,text:"n1" }}, // b
        {data: { id: '2' ,text:"n2" }}, // c
        {data: { id: '3' ,text:"n3" }}, // d
        {data: { id: '4' ,text:"n4"}}, // e
        {data: { id: '5' ,text:"n5"}}, // f
        {data: { id: '6' ,text:"n6"}}, // g
      ],
      edges: [
        {data: { id: '01', source: '0', target: '1' , weight: 10}},

        {data: { id: '02', source: '0', target: '2' ,weight: 20} },

        {data: { id: '13', source: '1', target: '3' ,weight: 20}},

        {data: { id: '14', source: '1', target: '4' ,weight: 20}},

        {data: { id: '25', source: '2', target: '5' ,weight: 20}},

        {data: { id: '26', source: '2', target: '6' ,weight: 20}},
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
          'curve-style': 'bezier',
          'label': 'data(weight)',
          'font-size': '10px',
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
    cy.elements().removeClass('highlighted')
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
    let startVertex = "#0";
    if (document.getElementById("startIndex").value != ""){
      startVertex =  "#"+document.getElementById("startIndex").value;
    }
    var bfs = cy.elements().bfs(startVertex, function () { }, true);
    // console.log(bfs);

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
    let startVertex = "#0";
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
    let startVertex = "#0";
    if (document.getElementById("startIndex").value != ""){
      startVertex =  "#"+document.getElementById("startIndex").value;
    }
    var mst = cy.elements().kruskal();
    console.log(mst);

    var i = 0;
      var highlightNextEle = function () {
        if (i < mst.length) {
          mst[i].addClass('highlighted');
    
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

  function genFromEdgeList(){
    cy.elements().remove()
    const N = document.querySelector('#numVert').value
    const adjListElement = document.querySelector('div.adjList').querySelector('.list');

    // Adding Nodes first
    var nodes = [];
    for(var i =0;i<N;i++){
      nodes.push({ group: 'nodes', data: { id: 'n'+i, text: "n"+i } })
    }
    cy.add(nodes)


    // Now add edges
    let edges =  [];

    adjListElement.querySelectorAll('div.edgeInList').forEach(edge => {
      let edgeFrom = edge.querySelector('#edge_src').value;
      let edgeTo = edge.querySelector('#edge_to').value;
      let edgeWeight = edge.querySelector('#edge_w').value;

      // edgeFrom = (edgeFrom == "") ? 
      edges.push({ group: 'edges', data: { id: `${edgeFrom}${edgeTo}`, source: `n${edgeFrom}`, target: `n${edgeTo}`,position: {x: 100,y:100}, weight : edgeWeight } })
    })

    console.log(edges);
    cy.add(edges)

    cy.layout({name:'cose'}).run()
  }

  function addEdgeinList(N){
    if (N < 0){
      return;
    }
    const adjListElement = document.querySelector('div.adjList').querySelector('.list');
    var htmlToInject = '';
    htmlToInject += `
    <input type="text" name="edge_src" id="edge_src" placeholder="From">
    <input type="text" name="edge_to" id="edge_to" placeholder="To">
    <input type="text" name="edge_w" id="edge_w" placeholder="Weight">
    <button class="btn btn-danger btn-small"><i class="fa fa-times"></i></button>
    `

    var divToInject = document.createElement('div')
    divToInject.classList.add('edgeInList')
    divToInject.innerHTML = htmlToInject;


    adjListElement.appendChild(divToInject);
  }

  function generateAdjList(N){
    if (N < 0){
      return;
    }
    const adjListElement = document.querySelector('div.adjList');
    let htmlToInject = '';
    for(let i=0;i<N;i++){
      htmlToInject += `
      <label for="vert_${i}">Vertex ${i}</label>
      <input type="text" name="vert_${i}" id="vert_${i}"><br>`;
    }
    htmlToInject += `<button class='btn btn-primary' id='submit' onclick="loadfromAdjList(${N})">Generate Graph</button>
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
        edges.push({ group: 'edges', data: { id: `${edgeFrom}${edgeTo}`, source: `n${edgeFrom}`, target: `n${edgeTo}`,position: {x: 100,y:100} } })
      })
    });

    cy.add(edges);

    // var layout = cy.elements().layout({
    //   name: 'cose', // breadthfirst
    //   rows: 3,
    //   directed: true,
    //   padding: 10,
    // })

    cy.layout({name:'cose'}).run()
    // replace eles


    // var eles = cy.add([
    //   { group: 'nodes', data: { id: 'n0', text: "n0" }, position: { x: 100, y: 100 } },
    //   { group: 'nodes', data: { id: 'n1', text: "n1" }, position: { x: 200, y: 200 } },
    //   { group: 'edges', data: { id: 'e0', source: 'n0', target: 'n1' } }
    // ]);

  }
   

