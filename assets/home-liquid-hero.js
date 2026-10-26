(() => {
  'use strict';

  const hero = document.querySelector('[data-liquid-hero]');
  const canvas = hero?.querySelector('.home-liquid-canvas');
  if (!hero || !canvas) return;

  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    powerPreference: 'high-performance'
  });
  if (!gl) {
    hero.classList.add('liquid-fallback');
    return;
  }

  const vertexSource = `
    attribute vec2 a_position;
    void main(){
      gl_Position=vec4(a_position,0.0,1.0);
    }
  `;

  const fragmentSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_hover;


    // A shared smooth distance field joins drops without overlapping surfaces.
    vec4 a,b,c,d,e,f,g,h,i,j,k,l,m,n,o;
    float merge(float x,float y,float k){
      float h=max(k-abs(x-y),0.0)/k;
      return min(x,y)-h*h*k*.25;
    }
    float organicSphere(vec3 p,vec4 ball,float phase){
      vec3 q=(p-ball.xyz)/ball.w;
      // Large chrome pools stay smooth and curved; only a restrained
      // low-frequency drift keeps them from reading as perfect spheres.
      q.x*=1.0+.055*sin(phase*.61);
      q.y*=1.0+.045*cos(phase*.83);
      float ripple=.007*sin(q.x*3.1+q.y*2.2+phase)
        +.004*sin(q.y*4.3-q.z*2.1-phase*1.4)
        +.003*cos(q.x*5.1+q.z*3.2+phase*.7);
      return (length(q)-1.0+ripple)*ball.w;
    }
    float roundSphere(vec3 p,vec4 ball){
      return length(p-ball.xyz)-ball.w;
    }
    float field(vec3 p){
      float v=organicSphere(p,a,.4);
      v=merge(v,organicSphere(p,b,1.7),.16);
      v=merge(v,organicSphere(p,c,2.8),.16);
      v=merge(v,organicSphere(p,d,3.9),.13);
      v=merge(v,organicSphere(p,e,5.1),.13);
      v=merge(v,organicSphere(p,f,6.2),.12);
      if(u_hover>.001) v=merge(v,organicSphere(p,g,7.4),.14);
      v=merge(v,roundSphere(p,h),.08);
      v=merge(v,roundSphere(p,i),.08);
      v=merge(v,roundSphere(p,j),.07);
      v=merge(v,roundSphere(p,k),.07);
      v=merge(v,roundSphere(p,l),.055);
      v=merge(v,roundSphere(p,m),.055);
      v=merge(v,roundSphere(p,n),.055);
      v=merge(v,roundSphere(p,o),.055);
      return v;
    }
    vec3 surfaceNormal(vec3 p){
      vec2 h=vec2(.001,0.0);
      return normalize(vec3(field(p+h.xyy)-field(p-h.xyy),
        field(p+h.yxy)-field(p-h.yxy),field(p+h.yyx)-field(p-h.yyx)));
    }
    vec3 studio(vec3 r){
      float band=smoothstep(-.38,-.14,r.y)-smoothstep(.08,.35,r.y);
      vec3 col=mix(vec3(.72,.75,.79),vec3(.018,.022,.030),band*.98);
      float softbox=pow(max(dot(r,normalize(vec3(-.66,.65,1.0))),0.0),7.0);
      float strip=pow(max(dot(r,normalize(vec3(.86,.18,.58))),0.0),26.0);
      float topBox=pow(max(dot(r,normalize(vec3(-.08,.96,.30))),0.0),15.0);
      float lower=pow(max(dot(r,normalize(vec3(-.20,-.86,.45))),0.0),10.0);
      // Cool studio reflections tie the silver surface to the Aurora palette.
      col+=softbox*vec3(.90,.98,1.05)+strip*vec3(.92,.87,1.16)
        +topBox*vec3(.64,.70,.82)+lower*vec3(.46,.54,.66);
      col=mix(col,col*vec3(.91,.96,1.0),.35);
      return clamp(col,0.0,1.0);
    }
    vec2 wander(float t,float phase){
      return vec2(
        .64*sin(t*.31+phase)+.28*sin(t*.83-phase*1.7)+.13*cos(t*1.61+phase*.4),
        .58*cos(t*.37+phase*1.3)+.26*sin(t*.97+phase*.7)+.12*cos(t*1.47-phase*1.1)
      );
    }
    float inOut(float p){
      return smoothstep(0.0,.10,p)*(1.0-smoothstep(.90,1.0,p));
    }
    void main(){
      vec2 uv=(gl_FragCoord.xy-u_resolution*.5)/u_resolution.y;
      float aspect=u_resolution.x/u_resolution.y;
      float compact=1.0-step(.72,aspect);
      float t=u_time*.65;
      float size=mix(1.0,.56,compact);
      float side=aspect*.43;
      vec2 w1=wander(t,.4),w2=wander(t,1.9),w3=wander(t,3.1);
      vec2 w4=wander(t,4.4),w5=wander(t,5.7),w6=wander(t,6.8);
      a=vec4(vec2(-side,.10)+w1*vec2(.12,.10),0.0,.23*size);
      b=vec4(vec2(-.20,-.58)+w2*vec2(.16,.10),0.0,.20*size);
      c=vec4(vec2(side,.34)+w3*vec2(.12,.13),0.0,.18*size);
      d=vec4(vec2(side-.18,-.20)+w4*vec2(.18,.15),0.0,.075*size);
      e=vec4(vec2(-side+.14,.30)+w5*vec2(.15,.18),0.0,.070*size);
      f=vec4(vec2(.19,-.53)+w6*vec2(.20,.13),0.0,.11*size);
      vec2 cursor=(u_mouse-u_resolution*.5)/u_resolution.y;
      g=vec4(cursor,0.02,.115*u_hover);

      // Four staggered lanes enter from different edges. The shared field
      // makes contact read as one liquid surface instead of layered circles.
      float p1=fract(t*.105+.07),p2=fract(t*.083+.41);
      float p3=fract(t*.097+.68),p4=fract(t*.073+.22);
      float f1=inOut(p1),f2=inOut(p2),f3=inOut(p3),f4=inOut(p4);
      vec2 lane1=vec2(mix(-side-.18,side+.18,p1),.48+.06*sin(t*1.13));
      vec2 lane2=vec2(mix(side+.18,-side-.18,p2),-.12+.05*cos(t*.91));
      vec2 lane3=vec2(-.44+.06*sin(t*.77),mix(.78,-.78,p3));
      vec2 lane4=vec2(.34+.05*cos(t*1.07),mix(-.78,.78,p4));
      h=vec4(lane1,.05,.060*size*(.25+.75*f1));
      i=vec4(lane2,-.01,.075*size*(.25+.75*f2));
      j=vec4(lane3,.03,.050*size*(.25+.75*f3));
      k=vec4(lane4,.02,.065*size*(.25+.75*f4));
      float s1=smoothstep(.78,1.0,p1),s2=smoothstep(.78,1.0,p2);
      float s3=smoothstep(.78,1.0,p3),s4=smoothstep(.78,1.0,p4);
      l=vec4(lane1+vec2(-.075,.045)*s1,.05,.030*size*s1);
      m=vec4(lane1+vec2(-.072,-.042)*s1,.05,.024*size*s1);
      n=vec4(lane2+vec2(.075,.040)*s2,-.01,.030*size*s2);
      o=vec4(lane2+vec2(.070,-.038)*s2,-.01,.024*size*s2);
      vec3 origin=vec3(uv,1.4);
      vec3 ray=vec3(0.0,0.0,-1.0);
      float travel=0.0;
      float dist=1.0;
      for(int i=0;i<56;i++){
        dist=field(origin+ray*travel);
        if(dist<.0008||travel>2.2) break;
        travel+=dist*.85;
      }
      vec3 color=vec3(0.0);
      float alpha=0.0;
      if(dist<.0008){
        alpha=1.0;
        vec3 point=origin+ray*travel;
        vec3 normal=surfaceNormal(point);
        color=studio(reflect(ray,normal));
        float rim=pow(1.0-max(normal.z,0.0),3.0);
        color=mix(color,vec3(.92,.96,1.0),rim*.52);
        color=pow(color,vec3(.84));

      }
      gl_FragColor=vec4(color,alpha);
    }
  `;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) {
    hero.classList.add('liquid-fallback');
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(program));
    hero.classList.add('liquid-fallback');
    return;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  gl.useProgram(program);
  const position = gl.getAttribLocation(program,'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);

  const resolution = gl.getUniformLocation(program,'u_resolution');
  const mouseUniform = gl.getUniformLocation(program,'u_mouse');
  const timeUniform = gl.getUniformLocation(program,'u_time');
  const hoverUniform = gl.getUniformLocation(program,'u_hover');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const gsapEngine = window.gsap;
  hero.dataset.motionEngine = gsapEngine?.version ? `GSAP ${gsapEngine.version}` : 'native';
  const motion = { x:.5, y:.5, hover:0 };
  const xTo = gsapEngine?.quickTo(motion,'x',{duration:.38,ease:'power3.out'});
  const yTo = gsapEngine?.quickTo(motion,'y',{duration:.38,ease:'power3.out'});
  const hoverTo = gsapEngine?.quickTo(motion,'hover',{duration:.42,ease:'power2.out'});
  let width=1;
  let height=1;
  let frame=0;
  let visible=true;
  let tickerActive=false;
  let manualPause=false;
  let elapsed=0;
  let lastDraw=0;
  const motionControl=hero.querySelector('[data-liquid-motion]');

  const resize = () => {
    const rect=hero.getBoundingClientRect();
    // Ray marching costs scale with pixel count; keep a modest buffer,
    // especially on large screens where high DPR adds no useful detail.
    const dpr=Math.min(devicePixelRatio||1,innerWidth<700?.85:.8,
      Math.sqrt(650000 / Math.max(1,rect.width*rect.height)));
    width=Math.max(1,Math.round(rect.width*dpr));
    height=Math.max(1,Math.round(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){
      canvas.width=width;
      canvas.height=height;
      gl.viewport(0,0,width,height);
    }
  };

  const draw = now => {
    frame=0;
    if(lastDraw && visible && !document.hidden && !reducedMotion.matches && !manualPause){
      elapsed+=Math.min((now-lastDraw)/1000,.05);
    }
    lastDraw=now;
    gl.useProgram(program);
    gl.uniform2f(resolution,width,height);
    gl.uniform2f(mouseUniform,motion.x*width,motion.y*height);
    gl.uniform1f(timeUniform,reducedMotion.matches?1.8:elapsed);
    gl.uniform1f(hoverUniform,motion.hover);
    gl.drawArrays(gl.TRIANGLES,0,6);
    if(!gsapEngine&&visible&&!document.hidden&&!reducedMotion.matches&&!manualPause) frame=requestAnimationFrame(draw);
  };

  const tick = () => draw(performance.now());

  const restart = () => {
    cancelAnimationFrame(frame);
    frame=0;
    lastDraw=0;
    const shouldAnimate=visible&&!document.hidden&&!reducedMotion.matches&&!manualPause;
    hero.classList.toggle('is-motion-paused',!shouldAnimate);
    if(motionControl){
      motionControl.hidden=reducedMotion.matches;
      motionControl.setAttribute('aria-pressed',String(manualPause));
      motionControl.textContent=manualPause?'Tiếp tục hiệu ứng':'Tạm dừng hiệu ứng';
    }
    if(gsapEngine){
      if(shouldAnimate&&!tickerActive){gsapEngine.ticker.add(tick);tickerActive=true;}
      if(!shouldAnimate&&tickerActive){gsapEngine.ticker.remove(tick);tickerActive=false;}
      draw(performance.now());
    }else if(shouldAnimate){
      frame=requestAnimationFrame(draw);
    }else{
      draw(performance.now());
    }
  };

  hero.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||manualPause) return;
    const rect=hero.getBoundingClientRect();
    const nextX=(event.clientX-rect.left)/rect.width;
    const nextY=1-(event.clientY-rect.top)/rect.height;
    if(reducedMotion.matches||!gsapEngine){motion.x=nextX;motion.y=nextY;motion.hover=1;}
    else{xTo(nextX);yTo(nextY);hoverTo(1);}
    hero.classList.add('is-pointer-active');
    if(reducedMotion.matches) draw(performance.now());
  });
  hero.addEventListener('pointerleave',()=>{
    if(reducedMotion.matches||!gsapEngine) motion.hover=0;
    else hoverTo(0);
    hero.classList.remove('is-pointer-active');
    if(reducedMotion.matches) draw(performance.now());
  });
  document.addEventListener('visibilitychange',restart);
  motionControl?.addEventListener('click',()=>{manualPause=!manualPause;restart();});
  reducedMotion.addEventListener('change',restart);
  if('ResizeObserver' in window) new ResizeObserver(()=>{resize();restart();}).observe(hero);
  else window.addEventListener('resize',()=>{resize();restart();});
  if('IntersectionObserver' in window) new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    restart();
  },{threshold:0}).observe(hero);

  resize();
  restart();
})();
