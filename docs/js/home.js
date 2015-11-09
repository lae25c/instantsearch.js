/* global $, TweenMax, TimelineMax, ScrollMagic, Power2, Bounce */
'use strict';

document.addEventListener('DOMContentLoaded', function(){
  var mapping = function(x) {
    var res = x;
    if(x>850) res += 60 * (Math.min(x, 950) - 850);
    if(x>1600) res += 60 * (Math.min(x, 1700) - 1600);
    if(x>2500) res += 60 * (Math.min(x, 2600) - 2500);
    return res;
  };

  var rand = new PRNG();
  var radiusScene = 10000;
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 1/radiusScene);
  var camera = new THREE.PerspectiveCamera( 55, window.innerWidth/window.innerHeight, 0.1, radiusScene * 10 );

  var renderer = new THREE.WebGLRenderer({ alpha: true });

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.querySelector('#space').appendChild( renderer.domElement );

  var particles = new THREE.Geometry();
  var sphere = new THREE.Sphere( new THREE.Vector3(0,0,0), radiusScene);
  var rand1 = function(){
    return rand.nextRange(-radiusScene, radiusScene);
  };

  for(var i = 0; i < 90000; i++ ){
    var p = new THREE.Vector3(rand1(), rand1(), rand1());
    p = sphere.clampPoint(p);
    particles.vertices.push(p);
  }

  var pMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 1,
    sizeAttenuation: false
  });
  var particleSystem = new THREE.Points(particles, pMaterial);

  scene.add(particleSystem);

  camera.position.z = 0;
  camera.rotation.x = - Math.PI / 2;

  var currentTSpring = 0;

  var render = function () {
    var dt = mapping(window.scrollY);
    currentTSpring += (dt - currentTSpring) / 50 ;
    requestAnimationFrame( render );

    var angle = currentTSpring/6000;

    camera.position.x = 500 * Math.cos(angle);
    camera.position.y = 500 * Math.sin(angle);
    camera.rotation.y = -angle - Math.PI / 2;

    renderer.render(scene, camera);
  };

  render();
});

$(function () {

  // init scroll magic
  var controller = new ScrollMagic.Controller({
    globalSceneOptions:{
      triggerHook:'onLeave'
    }
  });

  // get animation elements
  var windows = $('section.window');
  var $anim = $('#anim');
  var $overlay = $('#anim-overlay');
  var $spaceOverlay = $('#space-overlay');
  var $screens = $('.screen');
  var $widgets = $('.widget');
  var $widgetsTooltips = $('.widget-intro');
  var $illusSync = $('.illus-sync');
  var $screenshotWebsite = $('#screenshot-website');
  var $widgetsIcons = $('#anim-overlay img');
  var $animWidget1 = $anim.find('.widget-1');
  var $animWidget2 = $anim.find('.widget-2');
  var $animWidget3 = $anim.find('.widget-3');
  var $animWidget4 = $anim.find('.widget-4');
  var $animWidget5 = $anim.find('.widget-5');
  var $animWidget6 = $anim.find('.widget-6');
  var $animWidget7 = $anim.find('.widget-7');

  // Intro
  var intro = new TimelineMax();
  intro
    .set($screens, {opacity:0})
    .set($anim, {opacity:0, scale:0})
    .set($screenshotWebsite, {opacity:0})
    .set($overlay, {opacity:0})
    .set($widgetsIcons, {scale:0})
    .set($widgets, {opacity:0, scale:0})
    .to($anim, 2, {opacity:1, scale:1, rotationX:30, rotationZ:-6, ease:Power2.easeInOut})
    .to($screenshotWebsite, 1, {opacity:1}, '-=1')
    .to($animWidget1, 0.3, {scale:1 , opacity:1 })
    .to($animWidget2, 0.3, {scale:1 , opacity:1 })
    .to($animWidget3, 0.3, {scale:1 , opacity:1 })
    .to($animWidget4, 0.3, {scale:1 , opacity:1 }, '-=.2')
    .to($animWidget5, 0.3, {scale:1 , opacity:1 }, '-=.2')
    .to($animWidget6, 0.3, {scale:1 , opacity:1 }, '-=.2')
    .to($animWidget7, 0.3, {scale:1 , opacity:1 }, '-=.5')
    .to($overlay, 0.3, {opacity:1, ease:Power2.easeInOut }, '3.5')
    .to($widgetsIcons, 0.4, {scale:1, ease:Bounce.easeInOut }, '3.6');

  // An array to stock our timelines, relative to each sections
  var tl = [];
  // First Section
  tl[0] = new TimelineMax();
  tl[0]
    .to($widgetsTooltips, 2, {opacity:0})
    .to($widgets, 8, {z:400, opacity:0})
    .to($animWidget1, 8, {y:-350 }, '-=8')
    .to($animWidget3, 8, {x:-200, y:-50 }, '-=8')
    .to($animWidget4, 8, {x:-200 }, '-=8')
    .to($animWidget5, 8, {x:-200, y:50 }, '-=8')
    .to($animWidget6, 8, {x:-200, y:200 }, '-=8')
    .to($animWidget7, 8, {y:350 }, '-=8')
    .to($anim, 8, {opacity:1, scale:1, rotationX:0, rotationZ:0, ease:Power2.easeInOut}, '-=8')
    .to($illusSync, 4, {opacity:1}, '-=4')
    .to($spaceOverlay, 8, {backgroundColor:'#00B6BA' }, '0');

  // Second Section
  tl[1] = new TimelineMax();
  tl[1]
    .to($widgets, 0.2, {x:0, y:0, z:0, scale:0 })
    .to($illusSync, 3, {scale:0, opacity:0}, '+=3')
    .to($anim, 3, {scale:0.5 }, '-=3')
    .to($screenshotWebsite, 4, {opacity:0}, '-=5')
    .to('#anim > .widget', 2, {opacity:1, scale:1})
    .to('#screen-1', 3, {opacity:1})
    .to('#screen-1 .widget', 5, {opacity:1, scale:1},'-=2')
    .to('#screen-2', 3, {opacity:1})
    .to('#screen-2 .widget', 5, {opacity:1, scale:1},'-=2')
    .to('#screen-3', 3, {opacity:1})
    .to('#screen-3 .widget', 5, {opacity:1, scale:1},'-=2')
    .to($spaceOverlay, 8, {backgroundColor:'#F6624E' }, '0');

  // Third Section
  tl[2] = new TimelineMax();
  tl[2]
    .to($anim, 10, {scale:1, y:100, rotationX:20, rotationZ:-6, ease:Power2.easeInOut })
    .to($screens, 5, {opacity:0}, '-=8')
    .to($animWidget5, 4, {z:200})
    .to($animWidget5, 4, {rotationY:180, backgroundColor:'#674492'}, '-=2')
    .to($animWidget5, 4, {z:0})
    .to($spaceOverlay, 8, {backgroundColor:'#674492' }, '0');

  // Fourth Section
  tl[3] = new TimelineMax();
  tl[3]
    .to($anim, 12, {y:-400, rotationX:60}, '2s')
    .to($anim, 4, {opacity:0}, '5');

  // Create a scene for every window
  var scenes = [];
  for (var i=0; i<windows.length; i++) {

    scenes[i] = new ScrollMagic.Scene({
        triggerElement:windows[i],
        duration:800
      })
      .setTween(tl[i])
      .offset(20)
      // .addIndicators() // add indicators (requires plugin)
      .addTo(controller);
  }

  scenes[0].on('start', function () {
    intro.seek(20);
    TweenMax.to('header.site-header nav.navbar', 0.4, {backgroundColor:'rgba(0,0,0,0)'});
  });

  scenes[3].on('leave', function () {
    $('body:after').addClass('hide');
    TweenMax.to('header.site-header nav.navbar', 0.4, {backgroundColor:'rgba(0,0,0,1)'});
  });

});
