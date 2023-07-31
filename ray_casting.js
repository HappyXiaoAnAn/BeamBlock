function ray_casting(topo_H, vRadar, vCellSize, vMouse) {
    let bTileFound = false;
    let elev = 0.5;
    let hradar = topo_H[parseInt(vRadar.y/vCellSize.y)][parseInt(vRadar.x/vCellSize.x)] + 10;
    // let hradar = topo_H[parseInt(vRadar.y)][parseInt(vRadar.x)] + 100;
    
    let vRayEnd = {
        x: vMouse.x * vCellSize.x,
        y: vMouse.y * vCellSize.y
    };
    let vRayStart = Object.assign({},vRadar) // copy object
    // let vRayStart = {x:vRadar.x/vCellSize.x, y:vRadar.x/vCellSize.y} // copy object
    let vMapCheck = {
        x: parseInt(vRayStart.x/vCellSize.x),
        y: parseInt(vRayStart.y/vCellSize.y)
    };
    
    if (vRayEnd.x==vRayStart.x && vRayEnd.y==vRayStart.y) return null
    
    let vRayDir = {
        x: vRayEnd.x - vRayStart.x,
        y: vRayEnd.y - vRayStart.y
    };
    
    let vRayUnitStepSize = {
        x: Math.sqrt(1+(vRayDir.y/vRayDir.x)**2) * vCellSize.x,
        y: Math.sqrt(1+(vRayDir.x/vRayDir.y)**2) * vCellSize.y,
    };
    
    // 初始化檢查方向跟距離
    let vStep = {};
    let vRayLength1D = {};
    if (vRayDir.x < 0.0) {
        vStep.x = -1;
        tmp = (vRayStart.x / vCellSize.x - parseFloat(vMapCheck.x));
    } else {
        vStep.x = 1;
        tmp = 1 - (vRayStart.x / vCellSize.x - parseFloat(vMapCheck.x));
    }
    vRayLength1D.x = (tmp==0) ? 0.0 : tmp * vRayUnitStepSize.x
    
    if (vRayDir.y < 0.0) {
        vStep.y = -1;
        tmp = (vRayStart.y / vCellSize.y - parseFloat(vMapCheck.y));
    } else {
        vStep.y = 1;
        tmp = 1 - (vRayStart.y / vCellSize.y - parseFloat(vMapCheck.y));
    }
    vRayLength1D.y = (tmp==0) ? 0.0 : tmp * vRayUnitStepSize.y
    
    // Perform "Walk" until collision or range check
    let fMaxDistance = Math.sqrt((vRayEnd.x-vRayStart.x)**2+(vRayEnd.y-vRayStart.y)**2)
    let fDistance = 0.0
    let pHit = null;
    
    while (true) {
        // Walk along shortest path
        if (vRayLength1D.x < vRayLength1D.y) {
            vMapCheck.x += vStep.x;
            fDistance = vRayLength1D.x;
            vRayLength1D.x += vRayUnitStepSize.x;
        } else {
            vMapCheck.y += vStep.y;
            fDistance = vRayLength1D.y;
            vRayLength1D.y += vRayUnitStepSize.y;
        }
        
        // Test tile at new test point
        if (fDistance > fMaxDistance) break;
        const rearth = 6371000.0
        
        // METHOD 1.
        // let hh = fDistance*1*Math.sin(elev*Math.PI/180)+hradar+100

        // METHOD 2.
        // let alpha = (elev + 90)*Math.PI/180
        // let beta = Math.PI/2 - fDistance/rearth - elev*Math.PI/180
        // let hh = (rearth*Math.sin(alpha)/Math.sin(beta)-rearth)

        // METHOD 3.
        let ae = rearth*4/3
        let hh = ae*(Math.cos(elev*Math.PI/180)/Math.cos(elev*Math.PI/180+fDistance/ae)-1) + hradar

        if (vMapCheck.x >= 0 && vMapCheck.x < vMapSize.x && vMapCheck.y >= 0 && vMapCheck.y < vMapSize.y) {
            arr.push([hh,topo_H[vMapCheck.y][vMapCheck.x]]);
            if (topo_H[vMapCheck.y][vMapCheck.x] >= hh) {
                if (!bTileFound) pHit = Object.assign({},vMapCheck);
                bTileFound = true;
                // return vMapCheck;
            }
        }
    }
    return pHit;
    
}