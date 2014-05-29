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
- clean CSS style according browser used
- rename tt.js in enter.js split with styles.js
- add css generator function like shake.css and animate.css