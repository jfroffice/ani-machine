AniMachine
==========

Declarative animation and machine state build on top of AngularJS

Entering
--------

it allows to add entering animation like below
```
<div class="element" am-element enter="left move 800px over 2.0s">
</div>
```
using attribute __am-element__ on DOM element with special attribute __enter__

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
<am-state value="special" trigger=".trigger click">
	<am-event on="enter" animate="bounce"></am-event>
</am-state>
```

In this case, when user click on element selector by class ".trigger" element can change is state to __special__

Reveal Animation
----------------

Special state name are use to specify what animation you would like to play when entering or leaving the viewport.

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

You can chain animation by changing current __state__ using special word __goto__

or you can join animation name in the animate attribute

```
<am-state value="special" trigger=".trigger click">
	<am-event on="enter" animate="bounce rollOut"></am-event>
</am-state>
```


Autostart
---------

You can play animation on state activation using keyword __active__


Roadmap
-------
- add css generator function like shake.css
- change dynamically state property on element to know current state
- add move and rotate animation
- refactor angular directives in order to minimize coupling
- vanilla JS version