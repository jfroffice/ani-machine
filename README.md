AniMachine
==========

Declarative animation and machine state build on top of AngularJS.

Dependencies
------------
- AngularJS 1.2+
- Animate.css (optional)

Version
-------
AniMachine v0.1.3 (Proof Of Concept)

Entering
--------

it allows to add entering animation like below
```
<div class="element" am-element enter="left move 800px over 2.0s">
</div>
```
using attribute __am-element__ on DOM element with attribute __enter__

State
-----

by default you can declare a __default__ state like this
```
<div class="element" am-element enter="left move 800px over 2.0s">
	<am-state value="default">
		<am-event on="enter" animate="pulse"></am-event>
		<am-event on="leave" animate="tada"></am-event>
	</am-state>
</div>
```

inside you declare you would like to bind and special animation you would like to trigger on events

(Here is animation from animate.css)

Trigger Event
--------------

State can be change from a trigger
```
<am-state value="triggered" trigger=".btn click">
	<am-event on="enter" animate="bounce"></am-event>
</am-state>
```

In this case, when user click on element selector by class ".btn" element will is state defined by value

Autostart
---------

You can play animation on state activation using keyword __active__

Reveal Animation
----------------

Special state name are use to specify what animation you would like to play when entering or leaving the viewport.

This might happend when user scroll or resize browser window.

You can trigger animation with state __enter__
```
<am-state value="enter">
	<am-event on="active" animate="bounceInLeft"></am-event>
</am-state>
```

or state __leave__
```
<am-state value="enter">
	<am-event on="active" animate="bounceOutRight"></am-event>
</am-state>
```

Chaining
--------

You can chain animation using separate animate class name.

```
<am-state value="special" trigger=".trigger click">
	<am-event on="enter" animate="bounce rollOut"></am-event>
</am-state>
```

Or you chain animation by current __state__ using special word __goto__ 

```
<am-state value="default" trigger=".trigger click">
	<am-event on="enter" animate="bounce"></am-event>
	<am-event on="leave" goto="chain"></am-event>
</am-state>
<am-state value="chain">
	<am-event on="active" animate="rollOut"></am-event>
</am-state>
```

in the second case, trigger event will be unregistered which might be useful


Roadmap
-------
- add CSS generator function like shake.css
- add move and rotate animation
- vanilla JS version