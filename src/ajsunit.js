var AJSUnit = function(testSuite){
	//Private methods
	var stack = new Array();
	var currentMethodName =  '';
	var show = function(){
		if(document.getElementsByTagName('h1').length == 0){
			var h1Head = document.createElement('h1');
			h1Head.innerHTML = "Yes, it's an <a href='http://github.com/phstc/ajsunit'>Another JavaScript Unit Test library</a>";
			document.body.appendChild(h1Head);
		}
		var ulHead = document.createElement('ul');
		document.body.appendChild(ulHead);
		var assertions = 0;
		var failures = 0;
		var errors = 0;
		for(var i = 0; i < stack.length; i++){
			var liItemHead = document.createElement('li');
			ulHead.appendChild(liItemHead);			
			liItemHead.innerHTML = stack[i].methodName;
			var ulItemHead = document.createElement('ul');
			ulHead.appendChild(ulItemHead);
			for(var j = 0; j < stack[i].assertions.length; j++){
				var liItem = document.createElement('li');
				ulItemHead.appendChild(liItem);	
				liItem.innerHTML = 	publicMethods.htmlEscape(stack[i].assertions[j].assertionName + ' - ' +  stack[i].assertions[j].message);		
				if(stack[i].assertions[j].error){ 
					liItem.style.color = 'red';
					errors++;
				} else if(stack[i].assertions[j].fail){
					liItem.style.color = 'red';
					failures++;
				} else {//success
					liItem.style.color = 'green';
				}
				assertions++;
			}
		}
		var h2Foot = document.createElement('h2');
		h2Foot.innerHTML = 'Total: tests: ' + stack.length + ', assertions: ' + assertions + ', failures: ' + failures + ', errors: ' + errors;
		document.body.appendChild(h2Foot);
	};
	var getStackElementForCurrentMethodName = function(){
		for(var i = 0; i < stack.length; i++){
			if(stack[i].methodName == currentMethodName){
				return stack[i];
			}
		}
		var newElement =  {
			methodName: currentMethodName,
			assertions: new Array()
		}
		stack.push(newElement);
		return newElement;
	};
	var pushOnToStack = function(_assertionName, cond, _message){
		var element = getStackElementForCurrentMethodName();
		var assertionElement = {
			assertionName: _assertionName,
			message: (_message) ? _message : '',
			error: false,
			fail: false
		}
		if(!cond){
			assertionElement.fail = true;
		} else if(cond == null){
			assertionElement.error = true
		}
		element.assertions.push(assertionElement);
	};
	//Public methods
	var publicMethods = {
		htmlEscape: function(htmlText){
			return htmlText.replace(/>/ig, '&gt;').replace(/</ig, '&lt;');
		},
		ok: function(cond, message){
			if(message == null){
				message = 'test a condition';
			}			
			pushOnToStack('ok', cond, message);
		},		
		eq: function(expected, actual, message){
			if(message == null){
				message = 'expected: ' + expected + ', actual: ' + actual;
			}
			pushOnToStack('eq', expected == actual, message);
		},
		ne: function(expected, actual, message){
			if(message == null){
				message = 'expected: ' + expected + ', actual: ' + actual;
			}
			pushOnToStack('ne', expected != actual, message);
		},
		execute: function(){
			for(var methodName in testSuite.tests){
				currentMethodName = methodName;
				try{
					testSuite.tests[methodName](publicMethods);
				}catch(e){
					//errors++;
					pushOnToStack('error on the execution', null, e.message);
				}
			}
			show();
		},
		executeOnLoad: function(){
			var old = window.onload;
			var thisInstance = this;
			window.onload = function(){
				if(old != null){
					old();
				}
				thisInstance.execute();
			}
		}
	};
	return publicMethods;
};