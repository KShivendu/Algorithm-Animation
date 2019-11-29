var cy = cytoscape({
  container: document.getElementById("cy"), // container to render in

  elements: {
    // Initial graph nodes and edges

    nodes: [
      { data: { id: "0", text: "0" } }, 
      { data: { id: "1", text: "1" } }, 
      { data: { id: "2", text: "2" } }, 
      { data: { id: "3", text: "3" } }, 
      { data: { id: "4", text: "4" } }, 
      { data: { id: "5", text: "5" } },
      { data: { id: "6", text: "6" } }
    ],
    edges: [
      { data: { id: "0->1", source: "0", target: "1", weight: 10 } },

      { data: { id: "0->2", source: "0", target: "2", weight: 20 } },

      { data: { id: "1->3", source: "1", target: "3", weight: 20 } },

      { data: { id: "1->4", source: "1", target: "4", weight: 20 } },

      { data: { id: "2->5", source: "2", target: "5", weight: 20 } },

      { data: { id: "2->6", source: "2", target: "6", weight: 20 } }
    ]
  },

  style: [
    // Graph stylesheet
    {
      selector: "node",
      style: {
        "background-color": "#666",
        label: "data(id)",
        content: "data(text)",
        "font-size": "12px",
        "text-valign": "center",
        "text-halign": "center",

        "background-color": "#555",
        "text-outline-color": "#555",
        "text-outline-width": "2px",
        color: "#fff",
        "overlay-padding": "6px",
        "z-index": "10",

        width: "mapData(score, 0, 0.006769776522008331, 20, 60)",
        height: "mapData(score, 0, 0.006769776522008331, 20, 60)"
      }
    },

    {
      selector: "edge",
      style: {
        width: 3,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        label: "data(weight)",
        "font-size": "10px"
      }
    },

    {
      selector: ".highlighted",
      style: {
        "background-color": "#216b9c",
        "line-color": "#61bffc",
        "target-arrow-color": "#61bffc",
        "transition-property":
          "background-color, line-color, target-arrow-color",
        "transition-duration": "0.5s"
      }
    },

    {
      selector: "core",
      style: {
        "selection-box-color": "#AAD8FF",
        "selection-box-border-color": "#8BB0D0",
        "selection-box-opacity": "0.5"
      }
    }
  ],

  layout: {
    name: "cose",
    rows: 3,
    directed: true,
    padding: 10
  }
});

function runAlgorithm() {
  const algo = document.querySelector("#algorithmUsed").value;
  cy.elements().removeClass("highlighted");
  
  
  let startVertex = (document.getElementById("startIndex").value !== "") ? document.getElementById("startIndex").value : "#0";

  console.log("Starting vertex is: ", startVertex)


  if (algo === "BFS") {
    doBFS(startVertex);
  } else if (algo === "DFS") {
    doDFS(startVertex);
  } else if (algo === "MST") {
    doMST(startVertex);
  } else {
    alert("Invalid option");
  }
}

function doBFS(startVertex) {
  console.log(startVertex)
  var bfs = cy.elements().bfs("#"+startVertex, function() {}, true);

  animateFromObject(bfs);
}

function doDFS(startVertex) {
  var dfs = cy.elements().dfs("#"+startVertex, function() {}, true);
  animateFromObject(dfs);
}

function doMST() {
  animateFromArray(kruskal(cy.nodes().length, cy.edges()));
}


function genFromEdgeList() {
  cy.elements().remove();
  let N = document.querySelector("#numVert").value;
  if (N === "") {
    N = 3;
  }

  console.log("Generating a graph of ",N, " vertices");

  const adjListElement = document
    .querySelector("div.adjList")
    .querySelector(".list");

  // Adding Nodes first
  var nodes = [];

  for (var i = 0; i < N; i++) {
    nodes.push({ group: "nodes", data: { id: i, text:i } });
  }

  cy.add(nodes);

  // Now add edges
  let edges = [];

  adjListElement.querySelectorAll("div.edgeInList").forEach(edge => {
    let edgeFrom = edge.querySelector("#edge_src").value;
    let edgeTo = edge.querySelector("#edge_to").value;
    let edgeWeight = edge.querySelector("#edge_w").value;

    edges.push({
      group: "edges",
      data: {
        id: `${edgeFrom}->${edgeTo}`,
        source: `${edgeFrom}`,
        target: `${edgeTo}`,
        position: { x: 100, y: 100 },
        weight: edgeWeight
      }
    });
  });

  cy.add(edges);
  cy.layout({ name: "cose" }).run();

}

function addEdgeinList() {
  const adjListElement = document
    .querySelector("div.adjList")
    .querySelector(".list");
  var htmlToInject = "";
  htmlToInject += `
    <div class="row">
    <div class="col s3">
    <input type="text" name="edge_src" id="edge_src" placeholder="From">
    </div>
    <div class="col s3">
    <input type="text" name="edge_to" id="edge_to" placeholder="To">
    </div>
    <div class="col s3">
    <input type="text" name="edge_w" id="edge_w" placeholder="Weight">
    </div>
    <div class="col s3">
    <button id="del" class="btn red btn-small" onclick="deleteRow(this)"><i class="fa fa-times"></i></button>
    </div>
    </div>
    `;

  var divToInject = document.createElement("div");
  divToInject.classList.add("edgeInList");
  divToInject.innerHTML = htmlToInject;

  adjListElement.appendChild(divToInject);
}

function deleteRow(deleteButton) {
  deleteButton.parentElement.parentElement.parentElement.remove();
}


const kruskal = (vertexCount, edges) => {

  let tempArr = [];
  edges.forEach(edge => {
    tempArr.push({source : edge.source().data().id, target: edge.target().data().id , weight: edge.data().weight })
  })

  edges = tempArr;

  const sequence = [];
  let count = 0;

  const disjointSet = {
    parents: [],
    find: vertex => {
      while (disjointSet.parents[vertex] !== -1) {
        if (!disjointSet.parents[vertex]) {
          throw new Error("Invalid vertex");
        }
        vertex = disjointSet.parents[vertex];
      }
      return vertex;
    },
    union: (x, y) => {
      disjointSet.parents[disjointSet.find(x)] = disjointSet.find(y);
    }
  };

  for (let i = 0; i <= vertexCount-1 ; i++) {
    disjointSet.parents[i] = -1;
  }
  
  edges.sort((a, b) => a.weight - b.weight);
  

  for (const key in edges) {
    const edge = edges[key];


    if (disjointSet.find(edge.source) === disjointSet.find(edge.target)) {
      continue;
    }
    disjointSet.union(edge.source, edge.target);

    sequence.push(`${edge.source}`);
    sequence.push(`${edge.source}${edge.target}`);
    sequence.push(`${edge.target}`);

    count++;
    if (count >= vertexCount - 1) {
      break;
    }

  }

  return sequence;
};



function animateFromArray(arr,i = 0){
    if (i < arr.length) {
      console.log("Current element is : ",arr[i])
      cy.getElementById(arr[i]).addClass("highlighted"); 
      setTimeout(() => animateFromArray(arr,i+1), 500);
    }
}

function animateFromObject(arr,i = 0){
  if (i < arr.path.length) {
    // cy.getElementById(arr[i]).addClass("highlighted"); 
    arr.path[i].addClass("highlighted");
    setTimeout(() => animateFromObject(arr,i+1), 500);
  }
}

// window.onerror = (e) => {
//   document.getElementById("status").innerText = e;
// }


// var i = 0;
// var highlightNextEle = function () {
//   if (i < bfs.path.length) {
//     bfs.path[i].addClass('highlighted');

//     i++;
//     setTimeout(highlightNextEle, 500);
//   }
// };

// highlightNextEle();
