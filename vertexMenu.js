export function righty(e, points, rect, delHelper, addHelper) {
    let Xer = e.clientX - rect.left
    let Yer = e.clientY - rect.top

    let righty = document.getElementById("righty")
    
    let vertInd = -1
    for (let i = 0; i < points.length; i++) {
        if (points[i].x - 5 < Xer && points[i].x + 5 > Xer && points[i].y - 5 < Yer && points[i].y + 5 > Yer) {
            vertInd = i
        }
    }
    if (vertInd != -1 && vertInd < points.length) { // valid vertInd => mouse clicked a vertex
        righty.innerHTML = `
            <button id="deleteButton" class="deleteButton">Delete Vertex ${vertInd + 1}</button>
        `;
        document.getElementById("deleteButton").addEventListener("click", () => delHelper(vertInd));

    } else { // invalid vertInd => mouse clicked background / outside a vertex
        righty.innerHTML = `
            <button id="addButton" class="addButton">Add Vertex ${points.length + 1}</button>
        `;
        document.getElementById("addButton").addEventListener("click", () => addHelper(Xer, Yer));
    }

    // align the new context-menu to mousea position
    righty.className = "rightyShow"
    righty.style.top = `${e.clientY}px`
    righty.style.left = `${e.clientX}px`
}
