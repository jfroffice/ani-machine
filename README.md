AniMachine
==========
Declarative Animation and Simple Machine State.
- 4.5KB minified and Gzipped

### [→ Demo ←](http://jfroffice.github.io/ani-machine/)

Optional Dependencies
---------------------
- [animate.css](http://daneden.github.io/animate.css/)
- [csshake](http://elrumordelaluz.github.io/csshake/)

How to start 
------------ 
Add JS dependency
```
<script src="../ani-machine.min.js"></script>
```

At the end of DOM
```
<script>am.start();</script>
```

Enter Animation
---------------

Add __data-am__ attribute on DOM element with __":enter"__ special keyword
```
<div data-am=":enter left move 500px over 1.0s">HelloWorld</div>
```

State
-----
__default__ state can be declare like this
```
<div class="element" 
	data-am=":on enter :animate pulse
			 :on leave :animate tada">
</div>
```
If you want to declare a __next__
```
<div class="element" 
	data-am=""
 	data-am-next=":on enter :animate pulse
			 	  :on leave :animate tada">
</div>
```

How to change state ?
---------------------
You need to use __":go"__ keyword followed by state name to change state when played animation is finished
```
<div class="element" 
	data-am=":enter left move 500px :go next"
	data-am-next=":on enter :animate pulse
				  :on leave :animate tada">
</div>
```

How to launch CSS Animation
---------------------------
Add __":animate"__ keyword followed by animation CSS class name

```
<div class="element" 
	data-am=":animate tada">
</div>
```
Here we use [animate.css](http://daneden.github.io/animate.css/) class name, but it might be another css class

To chain CSS animation 
```
<div class="element" 
	data-am=":animate tada pulse">
</div>
```

How to launch CSShake Animation
---------------------------
Add __":shake"__ followed by [csshake](http://elrumordelaluz.github.io/csshake/) animation name you want to apply
```
<div class="element" 
	data-am=":shake slow">
</div>
```

How to trigger animation
------------------------
Use __":trigger"__ keyword
```
<div class="element" 
	data-am-special=":animate bounce
					 :trigger .btn--trigger click">
</div>
<div class=".btn--trigger"></div>
```
You can use default event 
- click (click 	    event)
- enter (mouseenter event)
- leave (mouseleave event)
- ...

Autostart
---------

By default, all DOM element with __data-am__ attribute will be in __default__ state

Reveal Animation
----------------

Special state name are use to specify animations you want to play when element is entering or leaving the viewport.

You can trigger animation with state __enter__
```
<div class="element" 
	data-am-enter=":enter left move 500px">
</div>
```
or state __leave__
```
<div class="element" 
	data-am-leave=":animate bounceOutRight">
</div>
```

Before and After Callbacks
--------------------------

You can bind __":before"__ or __":after"__ callback animation event
```
<div class="element" 
	data-am-enter=":before beforeFn() :enter left move 500px :after afterFn()">
</div>
```

```
<script>
function beforeFn() {
	console('before callback');
}
function afterFn() {
	console('after callback');
}
</script>
```