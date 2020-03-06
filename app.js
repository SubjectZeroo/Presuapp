

var budgetController = (function() {
 
})(); 




var UIController = (function() {
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

  return {
    getInput: function() {

      return {
        type: document.querySelector(DOMstrings.inputType).value, // sera un incremento o decremento
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();




var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListerners = function() {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if(event.keyCode === 13 || event.which === 13) {
        console.log('SE PRESIONA LA TECLA ENTER');
        ctrlAddItem();
  
      }
  
    });
  }

 

  var ctrlAddItem = function() {
    // 1 obtener datos del input data
    var input = UIController.getInput();
    console.log(input)
    // agregar dato al budget controller

    // 3 agregar los datos a la ui

    // 4 calcular el presupuesto

    // 5 mostrar el presupuero en la ui

    console.log('Si funciona')
  };

  return {
    init: function() {
      console.log('la aplicacion inicio');
      setupEventListerners();
    }
  };
})(budgetController, UIController);


controller.init();