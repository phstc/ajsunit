/*
 * The source code and documention of this project is available on https://github.com/phstc/ajsunit
 * Developer name: Pablo Cantero
 * Developer site: http://pablocantero.com
*/
var AJSUnit = function(testSuite){
	//Private methods
	var stack = new Array();
	var currentMethodName =  '';
	var createHTMLElement = function(parent, tagName, innerHTML){
		var el = document.createElement(tagName);
		if(innerHTML != null){
			el.innerHTML = innerHTML;
		}
		parent.appendChild(el);
		return el;		
	}
	var show = function(){
		if(document.getElementsByTagName('h1').length == 0){
			createHTMLElement(document.body, 
				'h1', 
				"Yes, it's an <a href='http://github.com/phstc/ajsunit'>Another JavaScript Unit Test library</a>");
		}
		var ulHead = createHTMLElement(document.body, 'ul');
		var assertions = 0;
		var failures = 0;
		var errors = 0;
		for(var i = 0; i < stack.length; i++){
			var liItemHead = createHTMLElement(ulHead, 'li', stack[i].methodName);
			var ulItemHead = createHTMLElement(ulHead, 'ul');
			for(var j = 0; j < stack[i].assertions.length; j++){
				var liItem = createHTMLElement(ulItemHead, 
					'li', 
					publicMethods.htmlEscape(stack[i].assertions[j].assertionName + ' - ' +  stack[i].assertions[j].message));		
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
		createHTMLElement(document.body, 
			'h2', 
			'Total: tests: ' + stack.length + ', assertions: ' + assertions + ', failures: ' + failures + ', errors: ' + errors);
	};
	//Get statck element for the currentMethodName
	var getStackElement = function(){
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
		var element = getStackElement();
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
	//Assertions/Public methods
	var assertionPublicMethods = {
		ok: function(cond, message){
			if(message == null){
				//Default message
				message = 'test a condition';
			}			
			pushOnToStack('ok', cond, message);
		},		
		eq: function(expected, actual, message){
			if(message == null){
				//Default message
				message = 'expected: ' + expected + ', actual: ' + actual;
			}
			pushOnToStack('eq', expected == actual, message);
		},
		ne: function(expected, actual, message){
			if(message == null){
				//Default message
				message = 'expected: ' + expected + ', actual: ' + actual;
			}
			pushOnToStack('ne', expected != actual, message);
		}		
	}
	//Public methods
	var publicMethods = {
		htmlEscape: function(htmlText){
			return htmlText.replace(/>/ig, '&gt;').replace(/</ig, '&lt;');
		},
		execute: function(){
			for(var methodName in testSuite.tests){
				currentMethodName = methodName;
				try{
					testSuite.tests[methodName](assertionPublicMethods);
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