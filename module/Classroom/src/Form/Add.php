<?php
namespace Classroom\Form;

use Zend\Form\Form;

Class Add extends Form {
    public function __construct($name = null){
        parent::__construct('add');
        $this->setAttribute('method', 'POST');
        $this->add([
            'name' => 'id',
            'type' => 'hidden',
            'attributes' => [
                'id' => 'room-id'
            ]
        ]);
        $this->add([
            'name' => 'materia',
            'type' => 'text',
            'options' => [
                'label' => 'Matéria:'
            ],
            'attributes' => [
                'id' => 'materia',
                'class' => 'form-control',
                'placeholder' => 'Nome da Matéria',
                'required' => true
            ]

        ]);
        $this->add([
            'name' => 'aula',
            'type' => 'text',
            'options' => [
                'label' => 'Aula:'
            ],
            'attributes' => [
                'id' => 'assunto',
                'class' => 'form-control',
                'placeholder' => 'Assunto da Aula',
                'required' => true
            ]

        ]);
        $this->add([
            'name' => 'submit',
            'type' => 'submit',
            'attributes' => [
                'value' => 'Criar Sala',
                'id'    => 'btn-join-as-teacher',
                'class' => 'btn btn-lg btn-success'
            ]
        ]);
    }
}

?>