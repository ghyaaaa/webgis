// import { Billboard } from 'cesium';
import $ from 'jquery'
const DrawTool = require('../../static/js/drawTool');

let Cesium = require('cesium/Cesium');

export function init (ele) {
    
    let centent = Cesium.Rectangle.fromDegrees(100,10,120,70);
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = centent;
    //天地图在线服务
    let mtdt = new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
        layer: "tiandituImg",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "tiandituImg",
        // credit: new Cesium.Credit('天地图全球影像服务'),
        // subdomains: ['t0', "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        maximumLevel: 18,
        show: true,
    });
    //谷歌
    let guge=new Cesium.UrlTemplateImageryProvider({            	
        url:'http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}',  
        tilingScheme:new Cesium.WebMercatorTilingScheme(),            	
        minimumLevel:1,            
        maximumLevel:20        
    });

    //天地图注记

    let tdtNoteLayerProvider = new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
        layer: "tiandituImgMarker",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "tiandituImgMarker",
        show: true,
        maximumLevel: 16
    });


    // Cesium.Ion.defaultAccessToke = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZmY4MGUzMi05ZjlhLTRkZTItODk1OC01Njg4NDhiNjNhNjkiLCJpZCI6MjYxMTAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODcyODA1MTd9.FyZ0BDw-aY0V4rwQJh4xTp0279LYI1cnlnj-f3_EmOg'
    // Cesium.Ion.defaultAccessToke = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNTU0NTAyMi1lYzcyLTRhYzgtOWEyYi1mNjIyYjUwY2QyM2EiLCJpZCI6MjYxMTAsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyIsInByIl0sImlhdCI6MTU4NzI4MDU1OH0.DZXQashMYqXoT7az-0nog0RSQrIT-UMhCmuSWdU2mac';
    
    let viewer = new Cesium.Viewer(ele,{
        homeButton: false,          
        imageryProvider : guge,
        infoBox : false,
        animation: false,  //是否显示动画控件
        baseLayerPicker: false, //是否显示图层选择控件
        geocoder: false, //是否显示地名查找控件
        timeline: false, //是否显示时间线控件
        sceneModePicker: false, //是否显示投影方式控件
        navigationHelpButton: false, //是否显示帮助信息控件
        infoBox: false,  //是否显示点击要素之后显示的信息
        fullscreenButton: false,
        contextOptions: {
            webgl: {
                alpha: true
            }
        }
    });
    let scene = viewer.scene;
    // let layers = scene.imageryLayers;
    var imageryLayers = viewer.imageryLayers;
    // viewer.scene.postProcessStages.fxaa.enabled = false;
    viewer.scene.globe.depthTestAgainstTerrain=true;
    //是否开启抗锯齿
    viewer.scene.fxaa = true;
    viewer.scene.postProcessStages.fxaa.enabled = true;

    if(Cesium.FeatureDetection.supportsImageRenderingPixelated()){//判断是否支持图像渲染像素化处理
        viewer.resolutionScale = window.devicePixelRatio;
    }
    // scene.debugShowDepthFrustum = 0;

    //取消双击事件
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    //设置第二重烘焙纹理的效果（明暗程度）
    // scene.shadowMap.darkness = 1.275;
    // scene.skyAtmosphere.brightnessShift=0.4;  //修改大气的亮度
    scene.debugShowFramesPerSecond = false;
    scene.hdrEnabled = false;
    scene.sun.show = false;
    let geoSever = 'http://127.0.0.1:8080/geoserver/world/wms';

    let drawTool = new DrawTool({
        viewer: viewer,
        hasEdit: true
    });
    //切换地图
    const _changeMap = {
        add: (id) => {
            
            switch (id){
                case 0:
                    let gugeLayer = viewer.imageryLayers.addImageryProvider(guge);

                    imageryLayers.raiseToTop(gugeLayer);
                break;
                case 1:
                    //加载影像底图
                    let arcgisLayer = imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
                    }))
                    imageryLayers.raiseToTop(arcgisLayer);

                break;
                case 2:
                    //高德
                    let gaode = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
                    }));
                    imageryLayers.raiseToTop(gaode);
                break;
                case 3:
                    //腾讯
                    let txLayer = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url : 'https://p2.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=229',
                        customTags : {
                            sx: function(imageryProvider, x, y, level) {
                                return x>>4;
                            },
                            sy:function(imageryProvider, x, y, level) {
                                return ((1<<level)-y)>>4;
                            }
                        }
                    }));
                    imageryLayers.raiseToTop(txLayer);
                break;
                case 4: 
                    //wfs
                    let wfs = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
                        url: 'http://127.0.0.1:8080/geoserver/world/wms',
                        layers: 'world:10m_admin_0_countries',
                        parameters: {
                            service : 'WMS', 
                            format: 'image/png', 
                            transparent: true, 
                        }
                       
                    }))
                    imageryLayers.raiseToTop(wfs);
                break;
            }
        }
    }


    //闪烁点
    const _point = {
      Init: function () {
        function f1() {
          let x=1;
          let flog=true;
          viewer.entities.add({
              name:"圆形区域闪烁",
              position:Cesium.Cartesian3.fromDegrees(100,20,1000),
              ellipse : {
                  semiMinorAxis : 2000.0,
                  semiMajorAxis : 2000.0,
                  height : 0,
                  material:new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function () {
                      if(flog){
                          x=x-0.05;
                          if(x<=0){
                              flog=false;
                          }
                      }else{
                          x=x+0.05;
                          if(x>=1){
                              flog=true;
                          }
                      }
                      return Cesium.Color.RED.withAlpha(x);
                  },false))
              }
          });
    
      }f1();
      function f2(){
          let x=1;
          let flog=true;
          viewer.entities.add({
              name:"圆点point闪烁",
              id: "ghy",
              position:Cesium.Cartesian3.fromDegrees(100+0.03,20+0.03,0),
              point : {
                  show : true, // default
                  color :new Cesium.CallbackProperty(function () {
                      if(flog){
                          x=x-0.05;
                          if(x<=0){
                              flog=false;
                          }
                      }else{
                          x=x+0.05;
                          if(x>=1){
                              flog=true;
                          }
                      }
                      return Cesium.Color.RED.withAlpha(x);
                  },false),
                  pixelSize : 10, // default: 1
                  outlineWidth :0
              }
          });
    
      } f2();
      viewer.zoomTo(viewer.entities);
      }
    }
    //公告板
    const _cBillboard = {
        init: function(data){
            viewer.entities.add({
                id: data.id || '',
                position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 10000),
                billboard: {
                    image : data.img || '../../static/image/2.png',
                    scaleByDistance: new Cesium.NearFarScalar(0, 0.5, 10000, 0.05),
                },
                events: {
                    click: data.event.click
                }
                  
            })
            viewer.zoomTo(viewer.entities);
        }
    }
    //模型
    const _CEntity = {
        init: function(){
            
        }
    }
    //热力图
    const _hotMap = function() {
        console.log(window.h337);
        let coordinate1 = [-109.0, 10.0, -80.0, 35.0];
        let heatMap1 = createHeatMap(getData(1000).max, getData(1000).data);
        creatRectangle(coordinate1, heatMap1);
        
    }
    // 创建热力图
    function createHeatMap(max, data) {
        // 创建元素
        let heatDoc = document.createElement("div");
        heatDoc.setAttribute("style", "width:1000px;height:1000px;margin: 0px;display: none;");
        document.body.appendChild(heatDoc);
        // 创建热力图对象
        let heatmap = h337.create({
            container: heatDoc,
            radius: 20,
            maxOpacity: .5,
            minOpacity: 0,
            blur: .75,
            gradient: {
                '0.9':'red',
                '0.8':'orange',
                '0.7':'yellow',
                '0.5':'blue',
                '0.3':'green',
            },
        });
        // 添加数据
        heatmap.setData({
            max: max,
            data: data
        });
        return heatmap;
    }
    // 创建正方形 绑定热力图 
    function creatRectangle(coordinate, heatMap) {
        viewer.entities.add({
            name: 'Rotating rectangle with rotating texture coordinate',
            show: true,
            rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(coordinate[0], coordinate[1], coordinate[2], coordinate[3]),
                material: heatMap._renderer.canvas // 核心语句，填充热力图
            }
        });
    }
    // 生成len个随机数据
    function getData(len) {
        //构建一些随机数据点
        let points = [];
        let max = 0;
        let width = 1000;
        let height = 1000;
        while (len--) {
            let val = Math.floor(Math.random() * 1000);
            max = Math.max(max, val);
            let point = {
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height),
                value: val
            };
            points.push(point);
        }
        return {max: max, data: points}
    }

    function Events(e){
        const eventType = [

            'LEFT_CLICK',
            'LEFT_DOUBLE_CLICK'
        ]
        console.log('123', e);
        
    }
    
    let removeHandler;
    let content;
    let autoInfoWindow;
    function appinfor(){
        let infoDiv = '<div id="trackPopUp" style="display:none;">'+
                    '<div id="trackPopUpContent" class="leaflet-popup" style="top:5px;left:0;">'+
                    '<a class="leaflet-popup-close-button" href="#">×</a>'+
                    '<div class="leaflet-popup-content-wrapper">'+
                        '<div id="trackPopUpLink" class="leaflet-popup-content" style="max-width: 300px;"></div>'+
                    '</div>'+
                    '<div class="leaflet-popup-tip-container">'+
                        '<div class="leaflet-popup-tip"></div>'+
                    '</div>'+
                    '</div>'+
                '</div>';
        $("#cesiumContainer").append(infoDiv);
    }

    function initPop(pick,movement){
        appinfor();
        $('#trackPopUp').show();
        let cartographic = Cesium.Cartographic.fromCartesian(movement.position);
        let point=[cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
        let destination=Cesium.Cartesian3.fromDegrees(point[0], point[1], 3000.0);
            let id=pick.id._id.replace(/[^0-9]/ig,"");
            content  = "<div style='border-bottom: 1px solid #C6CBCE;'>"+
            "<span style='margin-left: 5px;'>测试测试1</span>"+
            "<div id='infoClose3D' class='closeButton' style='margin-right: 4px;'></div>"+
            "</div>"+                                    
            "<div>"+
            "<label>测试1:</label><label>测试1</label></br>"+
            "<label>测试2:</label><label>测试2</label></br>"+
            "<label>测试3:</label><label>测试3</label></br>"+
            "</div>";
            let obj = {position:movement.position,destination:destination,content:content};
            infoWindow(obj);
            
            function infoWindow(obj) {
                let picked = scene.pick(obj.position);
                    if (Cesium.defined(picked)) {
                        let id = Cesium.defaultValue(picked.id, picked.primitive.id);

                        if (id instanceof Cesium.Entity) {
                            $(".cesium-selection-wrapper").show();
                            $('#trackPopUpLink').empty();
                            $('#trackPopUpLink').append(obj.content);
                            function positionPopUp (c) {
                                
                                let x = c.x - ($('#trackPopUpContent').width()) / 2;
                                let y = c.y - ($('#trackPopUpContent').height());
                                $('#trackPopUpContent').css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
                            }
                            // console.log('obj', obj)
                            let c = new Cesium.Cartesian2(obj.position.x, obj.position.y);
                            $('#trackPopUp').show();
                            positionPopUp(c); // Initial position
                                                        // at the place item
                                                        // picked
                            removeHandler = viewer.scene.postRender.addEventListener(function () {
                                let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, id._position._value);
                                if ((c.x !== changedC.x) || (c.y !== changedC.y)) {
                                    positionPopUp(changedC);
                                    c = changedC;
                                }
                            });
                                // PopUp close button event handler
                            $('.leaflet-popup-close-button').click(function() {
                                $('#trackPopUp').hide();
                                $('#trackPopUpLink').empty();
                                $(".cesium-selection-wrapper").hide();
                                removeHandler.call();
                                return false;
                            });	            				
                            return id;
                        }
                    }	    	
                } 
    }

    function bindEvent(){

        //鼠标移动
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        //
        handler.setInputAction(function(movement) {
            					
            let pick = scene.pick(movement.position);
            
            console.log(pick);
            if(pick && pick.id){
                // console.log(pick.id);
                // initPop(pick,movement);
                // initChart(pick, movement);
                if (!!pick.id.events){

                    pick.id.events.click();
                    // let cartographic = Cesium.Cartographic.fromCartesian(movement.position);
                    // let point=[cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
                    // let destination=Cesium.Cartesian3.fromDegrees(point[0], point[1], 3000.0);
                    
                    // let obj = {position:movement.position,destination:destination};
                    // let picked = scene.pick(obj.position);
                    // let id = Cesium.defaultValue(picked.id, picked.primitive.id);
                    // let c = new Cesium.Cartesian2(obj.position.x, obj.position.y);

                    // function positionPopUp (c) {


                    //     var x = c.x - ($('#chart1').width()) / 2;
                    //     var y = c.y - ($('#chart1').height());
                    //     $('#chart1').css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
                    // }
                    // positionPopUp(c);

                    // removeHandler = viewer.scene.postRender.addEventListener(function () {
                    //     let changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, id._position._value);
                    //     if ((c.x !== changedC.x) || (c.y !== changedC.y)) {
                    //         positionPopUp(changedC);
                    //         c = changedC;
                    //     }
                    // });
                }
            }
            else{
                $('#trackPopUp').hide();
               
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        
    }

    bindEvent();
    var CreatePolyline = (function() {
        function _(positons) {
            if (!Cesium.defined(positons)) {
                throw new Cesium.DeveloperError('positions is required!');
            }
            if (positons.length < 2) {
                throw new Cesium.DeveloperError('positions 的长度必须大于等于2');
            }
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
                    clampToGround: true
                }
            };
            this.path = positons;
    
            this._init();
        }
    
        _.prototype._init = function() {
            var that = this;
            var positionCBP = function() {
                return that.path;
            };
            this.options.polyline.positions = new Cesium.CallbackProperty(positionCBP, false);
            this.lineEntity = viewer.entities.add(this.options);
        };
    
        return _;
    })();
    //量算工具
    // let html = '<div id="toolTip" class="measure-mouse-tip" style="display:none;color:rgb(236, 159, 30);border: 1px solid rgb(236, 159, 30);position:absolute;font-size:12px;color:#fff">单击开始，双击结束</div>';
    // $('.cesium-viewer').append(html);
    //测量距离
    

    //获取线段距离
    var getDistance=function(path){
        var Len = 0;
        let ellipsoid = scene.globe.ellipsoid;
        let WebMercatorProjection = new Cesium.WebMercatorProjection();
        var distance = 0+'米';
        var cg, cs, x1, y1, x2, y2;
        for (let i = 0; i < path.length-1; i += 1) {
            cg = ellipsoid.cartesianToCartographic(path[i]);
            cs = WebMercatorProjection.project(cg);
            x1 = cs.x;
            y1 = cs.y;
            cg = ellipsoid.cartesianToCartographic(path[i+1]);
            cs = WebMercatorProjection.project(cg);
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

    /*
        流纹纹理线
        color 颜色
        duration 持续时间 毫秒
    */
    var lat =  42.006;
    var lon = 128.055;
    viewer.scene.globe.depthTestAgainstTerrain = true;
    //取消双击事件
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    function PolylineTrailLinkMaterialProperty(color, duration, d) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = color;
        this.duration = duration || 3000;
        this._time = (new Date()).getTime();
        // this._d=d;
        // this.isTranslucent = function () {
        //     return true;
        // }
    }

    Cesium.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
        isConstant: {
            get: function () {
                return false;
            }
        },
        definitionChanged: {
            get: function () {
                return this._definitionChanged;
            }
        },
        color: Cesium.createPropertyDescriptor('color')
    });

    PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
        return 'PolylineTrailLink';
    }
    PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
        result.image = Cesium.Material.PolylineTrailLinkImage;
        result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
        return result;
    }
    PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
        return this === other ||
            (other instanceof PolylineTrailLinkMaterialProperty &&
              Property.equals(this._color, other._color))
    }

    Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
    Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
    Cesium.Material.PolylineTrailLinkImage = "./static/image/colors.png";
    Cesium.Material.PolylineTrailLinkSource = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                      {\n\
                                                           czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                           vec2 st = materialInput.st;\n\
                                                           vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                           material.alpha = colorImage.a * color.a;\n\
                                                           material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                           return material;\n\
                                                       }";
        

    Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
        fabric: {
            type: Cesium.Material.PolylineTrailLinkType,
            uniforms: {
                color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                image: Cesium.Material.PolylineTrailLinkImage,
                time: 0
            },
            source: Cesium.Material.PolylineTrailLinkSource
        },
        translucent: function (material) {
            return true;
        }
    });

    var isAdd = false;
    var entitys = null;
    function setvisible(value) {
        switch (value) {
            case 'position':
                viewer.camera.setView({
                    destination: Cesium.Cartesian3.fromDegrees(lon, lat, 300000)
                });
                break;
            case 'add':
                if (!isAdd) {
                    entitys = viewer.entities.add({
                        name: 'PolylineTrail',
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights([lon, lat, 2500,
                                                                                  lon + 10, lat, 2500,
                                                                                  lon + 10, lat + 10, 2500, ]),
                            width: 15,
                            material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.ORANGE, 3000)
                        }
                    });
                    isAdd = true;
                }
                break;
            case 'del':
                if (isAdd) {
                    viewer.entities.remove(entitys);
                    isAdd = false;
                }
                break;
        }
    }

    //wenlixian  path
    var material = null;
    var center = { lon: 114.302312702, lat: 30.598026044 }
    var cities = [{ "lon": 115.028495718, "lat": 30.200814617 },
        { "lon": 110.795000473, "lat": 32.638540762 },
        { "lon": 111.267729446, "lat": 30.698151246 },
        { "lon": 112.126643144, "lat": 32.058588576 },
        { "lon": 114.885884938, "lat": 30.395401912 },
        { "lon": 112.190419415, "lat": 31.043949588 },
        { "lon": 113.903569642, "lat": 30.932054050 },
        { "lon": 112.226648859, "lat": 30.367904255 },
        { "lon": 114.861716770, "lat": 30.468634833 },
        { "lon": 114.317846048, "lat": 29.848946148 },
        { "lon": 113.371985426, "lat": 31.704988330 },
        { "lon": 109.468884533, "lat": 30.289012191 },
        { "lon": 113.414585069, "lat": 30.368350431 },
        { "lon": 112.892742589, "lat": 30.409306203 },
        { "lon": 113.160853710, "lat": 30.667483468 },
        { "lon": 110.670643354, "lat": 31.748540780 }]

    function parabolaEquation(options, resultOut) {
        //方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
        var h = options.height && options.height > 5000 ? options.height : 5000;
        var L = Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat) ? Math.abs(options.pt1.lon - options.pt2.lon) : Math.abs(options.pt1.lat - options.pt2.lat);
        var num = options.num && options.num > 50 ? options.num : 50;
        var result = [];
        var dlt = L / num;
        if (Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat)) {//以lon为基准
            var delLat = (options.pt2.lat - options.pt1.lat) / num;
            if (options.pt1.lon - options.pt2.lon > 0) {
                dlt = -dlt;
            }
            for (var i = 0; i < num; i++) {
                var tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
                var lon = options.pt1.lon + dlt * i;
                var lat = options.pt1.lat + delLat * i;
                result.push([lon, lat, tempH]);
            }
        } else {//以lat为基准
            var delLon = (options.pt2.lon - options.pt1.lon) / num;
            if (options.pt1.lat - options.pt2.lat > 0) {
                dlt = -dlt;
            }
            for (var i = 0; i < num; i++) {
                var tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
                var lon = options.pt1.lon + delLon * i;
                var lat = options.pt1.lat + dlt * i;
                result.push([lon, lat, tempH]);
            }
        }
        if (resultOut != undefined) {
            resultOut = result;
        }
        return result;
    }

    function setvisible_path(value) {
        switch (value) {
            case 'position':
                viewer.camera.setView({
                    destination: Cesium.Cartesian3.fromDegrees(lon, lat, 300000)
                });
                break;
            case 'add':
                if (!isAdd) {
                    if (material != null) { } else {
                        material = new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.ORANGE, 3000);
                    }
                    for (var j = 0; j < cities.length; j++) {
                        var points = parabolaEquation({ pt1: center, pt2: cities[j], height: 50000, num: 100 });
                        var pointArr = [];
                        for (var i = 0; i < points.length; i++) {
                            pointArr.push(points[i][0],points[i][1],points[i][2]);
                        }
                        viewer.entities.add({
                            name: 'PolylineTrailLink' + j,
                            polyline: {
                                positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointArr),
                                width: 2,
                                material: material
                            }
                        });
                    }

                    viewer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(center.lon, center.lat, 1),
                        point: {
                            pixelSize: 6,
                            color: Cesium.Color.BLUE
                        }
                    });
                    for (var i = 0; i < cities.length; i++) {
                        viewer.entities.add({
                            position: Cesium.Cartesian3.fromDegrees(cities[i].lon, cities[i].lat, 1),
                            point: {
                                pixelSize: 6,
                                color: Cesium.Color.RED
                            }
                        });
                    }

                    isAdd = true;
                }
                break;
            case 'del':
                if (isAdd) {
                    viewer.entities.removeAll();
                    isAdd = false;
                }
                break;
        }
    }

    //圆形波纹
    function addCircleRipple () {
        var data = {
            deviationR: 10,//差值 差值也大 速度越快
            eachInterval: 2000,//两个圈的时间间隔
            imageUrl:"../../static/image/redRircle.png",
            maxR: 10000
        };

        var r1=0,r2=0; var r3=0,r4=0;
        function changeR1() { //这是callback，参数不能内传
            r1=r1+data.deviationR;
            if(r1>=data.maxR){
                r1=0;
            }
            return r1;
        }
        function changeR2() {
            r2=r2+data.deviationR;
            if(r2>=data.maxR){
                r2=0;
            }
            return r2;
        }

        //第一个圆先跑
        viewer.entities.add({
            description:"LIGHT_POINTS",
            position:Cesium.Cartesian3.fromDegrees(120,20,1000),
            show:true,
            ellipse:{
                semiMinorAxis :new Cesium.CallbackProperty(changeR1,false),
                semiMajorAxis :new Cesium.CallbackProperty(changeR2,false),
                height:10,
                material:new Cesium.ImageMaterialProperty({
                    image:data.imageUrl,
                    repeat:Cesium.Cartesian2(1.0, 1.0),  //指定图像在每个方向上重复的次数,默认为Cesium.Cartesian2(1.0, 1.0),{Cartesian2}类型
                    transparent:true,// 默认为false，当图像具有透明性时设置为true（例如，当png具有透明部分时）
                    color:new Cesium.CallbackProperty(function () {
                        var alp=1-r1/data.maxR;
                        return  Cesium.Color.WHITE.withAlpha(alp)
                        //entity的颜色透明 并不影响材质，并且 entity也会透明
                    },false)
                })
            }
        });

        //第二个圆开始跑
        setTimeout(() => {
            function changeR11() { //这是callback，参数不能内传
                r3=r3+data.deviationR;
                if(r3>=data.maxR){
                    r3=0;
                }
                return r3;
            }
            function changeR12() {
                r4=r4+data.deviationR;
                if(r4>=data.maxR){
                    r4=0;
                }
                return r4;
            }
            
            viewer.entities.add({
                description:"LIGHT_POINTS",
                position:Cesium.Cartesian3.fromDegrees(120,20,1000),
                show:true,
                ellipse:{
                    semiMinorAxis :new Cesium.CallbackProperty(changeR11,false),
                    semiMajorAxis :new Cesium.CallbackProperty(changeR12,false),
                    height:10,
                    material:new Cesium.ImageMaterialProperty({
                        image:data.imageUrl,
                        repeat:Cesium.Cartesian2(1.0, 1.0),
                        transparent:true,
                        color:new Cesium.CallbackProperty(function () {
                            var alp=1-r1/data.maxR;
                            return  Cesium.Color.WHITE.withAlpha(alp)
                            //entity的颜色透明 并不影响材质，并且 entity也会透明
                        },false)
                    })
                }
            });
        }, 1000)

        // viewer.entities.add({
        //     description:"LIGHT_POINTS",
        //     position:Cesium.Cartesian3.fromDegrees(120,20,1000),
        //     show:true,
        //     ellipse:{
        //         semiMinorAxis : 500,
        //         semiMajorAxis : 500,
        //         height:10,
        //         material:new Cesium.Color(1,0,0,1)
        //     }
        // });
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(120,20,1000)
        })
    }
    
    function _drawLine(){
        viewer.entities.add({
            position : Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 10000),
            point : {
                pixelSize : 10,
                color : Cesium.Color.YELLOW
            },
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([75, 35, 125, 35]),
                width: 10,
                clampToGround: true,//开启贴地
                material: Cesium.Color.RED
            }
         });
    }

    const pub = {
        viewer,
        scene,
        point: _point,
        cBillboard: _cBillboard,
        hotMap: _hotMap,
        // measureDistance: _measureDistance,
        drawLine: _drawLine,
        setvisible,
        setvisible_path,
        addCircleRipple,
        changeMap: _changeMap,
        drawTool,
        
    }
    return pub;

  }
