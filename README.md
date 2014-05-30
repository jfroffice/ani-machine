AniMachine
==========

Declarative animation and machine state

```
<div class="element" am-element enter="left move 800px over 2.0s">
	<am-state value="default">
		<am-event on="enter" animate="pulse"></am-event>
		<am-event on="leave" animate="tada"></am-event>
	</am-state>
</div>
```

GuideLine
---------

- add new trigger like element visible on scroll
- add trigger like mouse near
- add css generator function like shake.css and animate.css