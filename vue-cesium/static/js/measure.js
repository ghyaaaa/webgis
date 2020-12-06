
var measureDistance = function(viewer){

    this.isDraw = false;
    this.polylinePath = [];
    this.polylineCartographic = [];//弧度数组,地表插值用
    this.polyline = undefined;
    this.positions = [];
    this.viewer = viewer;
    this.scene = viewer.scene;
    this.ellipsoid = this.scene.globe.ellipsoid;
    this.billboards = new Cesium.BillboardCollection();
    this.scene.primitives.add(this.billboards);
    this.WebMercatorProjection = new Cesium.WebMercatorProjection();
    this.handler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
    //初始化鼠标提示框
    this.prompt = new MovePrompt(viewer);
    this.entities = [];
    this.billboard=undefined;

    $(".cesium-selection-wrapper").hide();
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);   
}

var CreatePolyline = (function() {
    function _(positons, viewer) {
        if (!Cesium.defined(positons)) {
            throw new Cesium.DeveloperError('positions is required!');
        }
        if (positons.length < 2) {
            throw new Cesium.DeveloperError('positions 的长度必须大于等于2');
        }
        console.log(positons);
        var material = Cesium.Material.fromType(Cesium.Material.ColorType);
        material.uniforms.color = new Cesium.Color(1.0, 1.0, 0.0, 0.5);
        this.options = {
            polyline : {
                show : true,
                width : 4,
                material : new Cesium.PolylineOutlineMaterialProperty({
                    color : Cesium.Color.ORANGE.withAlpha(0.5),
                    outlineWidth : 0,
                    outlineColor : Cesium.Color.ORANGE
                }),
                depthFailMaterial : new Cesium.PolylineOutlineMaterialProperty({
                    color : Cesium.Color.RED,
                    outlineWidth : 1,
                    outlineColor : Cesium.Color.RED
                }),
                // clampToGround: true,
                followSurface : true
            }
        };
        this.path = positons;

        this._init(viewer);
    }

    _.prototype._init = function(viewer) {
        var that = this;
        var positionCBP = function() {
            return that.path;
        };
        this.options.polyline.positions = new Cesium.CallbackProperty(positionCBP, false);
        this.lineEntity = viewer.entities.add(this.options);
    };

    return _;
})();

//获取线段距离
var getDistance=function(path, _this){
    var Len = 0;
    var distance = 0+'米';
    var cg, cs, x1, y1, x2, y2;
    for (i = 0; i < path.length-1; i += 1) {
        cg = _this.ellipsoid.cartesianToCartographic(path[i]);
        cs = _this.WebMercatorProjection.project(cg);
        x1 = cs.x;
        y1 = cs.y;
        cg = _this.ellipsoid.cartesianToCartographic(path[i+1]);
        cs = _this.WebMercatorProjection.project(cg);
        x2 = cs.x;
        y2 = cs.y;
        Len = Len + Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
    }
    if(Len>0){
        distance=Len.toFixed(2)+'米'
    }
    if(Len/1000>=1){
        distance=(Len/1000).toFixed(2)+'公里';
    }
    return distance;
}

//线段之间地表插值
var SurfaceLine=function(cartographic, _this){
    _this.polylineCartographic.push(cartographic);
    var terrainSamplePositions = [];
    if (_this.polylineCartographic.length > 1) {
        var p1 = _this.polylineCartographic[_this.polylineCartographic.length - 2];
        var p2 = _this.polylineCartographic[_this.polylineCartographic.length - 1];
        var a = Math.abs(p1.longitude - p2.longitude) * 10000000;
        var b = Math.abs(p1.latitude - p2.latitude) * 10000000;
        if (a > b) b = a;
        var length = parseInt(b / 10);
        if (length > 1000) length = 1000;
        if (length < 2) length = 2;
        for (var i = 0; i < length; ++i) {
            terrainSamplePositions.push(
                new Cesium.Cartographic(
                    Cesium.Math.lerp(p1.longitude, p2.longitude, i / (length - 1)),
                    Cesium.Math.lerp(p1.latitude, p2.latitude, i / (length - 1))
                )
            );
        }

    }
    else {
        terrainSamplePositions = _this.polylineCartographic;
    }
    if(terrainSamplePositions.length>0){
        for(var j=0;j<terrainSamplePositions.length;j++){
            //地理坐标（弧度）转经纬度坐标
            var cartographic = terrainSamplePositions[j];
            var height = _this.scene.globe.getHeight(cartographic);
            var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);
            _this.polylinePath.push(point);
            //console.log(point);
        }
    }
}

measureDistance.prototype = {
    startDraw: function () {
        let _this = this;
        _this.isDraw = true;

        _this.handler.setInputAction(function(movement) {
            //新增部分
            var position1;
            var cartographic;
            var ray = _this.scene.camera.getPickRay(movement.endPosition);
            if(ray){

                position1 = _this.scene.globe.pick(ray, _this.scene);
            }
            if(position1){
                //做转换
                cartographic= Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
            }
            if (cartographic){
                //海拔
                var height = _this.scene.globe.getHeight(cartographic);
                 //地理坐标（弧度）转经纬度坐标
                var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);
                if (_this.isDraw){

                    if (_this.polylinePath.length < 1) {
                        _this.prompt.updatePrompt(movement.endPosition, "单击开始绘制");
                        return;
                    }
                    
                    if (!Cesium.defined(_this.polyline)) {
                        _this.polylinePath.push(point);
                        _this.polyline = new CreatePolyline(_this.polylinePath, _this.viewer);
                    } else {
                        _this.polyline.path.pop();
                        _this.polyline.path.push(point);
                    }
    
                    if(_this.polylinePath.length>=1){
                        if(_this.polyline && _this.polyline.path){
                            var distance = getDistance(_this.polyline.path, _this);
                            _this.prompt.updatePrompt(movement.endPosition, `${distance}\n单击新增，右键删除，双击停止`);
    
                        }
                    }
                }
            }


        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        _this.handler.setInputAction(function(movement) {
            var position1;
            var cartographic;
            var ray = _this.scene.camera.getPickRay(movement.position);

            if(ray){

                position1 = _this.scene.globe.pick(ray, _this.scene);
            }
            if(position1){
                //做转换
                cartographic= Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
            }
            if(cartographic){
                //海拔
                var height = _this.scene.globe.getHeight(cartographic);
                //地理坐标（弧度）转经纬度坐标
                var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);
                if (_this.isDraw){

                    var text="起点";
                    if(_this.polyline){
    
                        _this.polyline.path.pop();
                    }
                    // _this.polylinePath.push(point);
                    SurfaceLine(cartographic, _this);
                    if (_this.polyline){
    
                        text = getDistance(_this.polyline.path, _this);
                    }
                    _this.entities.push(_this.viewer.entities.add({
                        position: point,
                        point: {
                            heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                            show: true,
                            color: Cesium.Color.SKYBLUE,
                            pixelSize: 3,
                            outlineColor: Cesium.Color.YELLOW,
                            outlineWidth: 1
                        },
                        label: {
                            text: text,
                            font: '12px sans-serif',
                            style : Cesium.LabelStyle.FILL,
                            outlineWidth : 1,
                            fillColor:Cesium.Color.WHITE,
                            showBackground:false,
                            backgroundColor:Cesium.Color.ORANGE.withAlpha(0.6),
                            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                            pixelOffset: new Cesium.Cartesian2(5.0,-20.0),
                        }
                    }));
                }
            }


        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        _this.handler.setInputAction(function(movement){
            _this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            _this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            _this.viewer.trackedEntity = undefined;

            _this.isDraw = false;
            _this.billboard = _this.billboards.add({
                show : true,
                id:"measureTool",
                position : _this.polylinePath[_this.polylinePath.length-1],
                pixelOffset : new Cesium.Cartesian2(0.0, 20),
                eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0),
                horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                verticalOrigin : Cesium.VerticalOrigin.CENTER,
                scale : 1.0,
                image: '/static/image/measure/close.png',
                color : new Cesium.Color(1.0, 1.0, 1.0, 1.0),
            });
            if(_this.prompt){
				_this.prompt.destroy();
				_this.prompt = null;
            }
            
            //关闭按钮执行事件
        _this.handler.setInputAction(function(movement){
            var pickedObjects ={};
            pickedObjects = _this.scene.drillPick(movement.position);
            if (Cesium.defined(pickedObjects)) {
                for (var i = 0; i < pickedObjects.length; i++){

                    if (pickedObjects[i].primitive == _this.billboard){
                        _this.viewer.entities.remove(_this.polyline.lineEntity);
                        for(var j=0;j<_this.entities.length;j++){
                            _this.viewer.entities.remove(_this.entities[j]);
                        }
                        _this.entities=[];
                        _this.billboards.remove(_this.billboard);
                        _this.polylinePath = [];
                        _this.polyline = undefined;
                        _this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    }
                }
            }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);

        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    }
}

module.exports = measureDistance;