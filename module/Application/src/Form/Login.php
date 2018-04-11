<?php
namespace Application\Form;

use Zend\Form\Form;

Class Login extends Form {
    public function __construct($name = null){
        parent::__construct('login');
        $this->setAttribute('method', 'POST');
        $this->add([
            'name' => 'usuario',
            'type' => 'text',
            'options' => [
                'label' => 'Usuário:'
            ],
            'attributes' => [
                'id' => 'user',
                'class' => 'form-control',
                'placeholder' => 'Matrícula do usuário',
                'required' => true
            ]

        ]);
        $this->add([
            'name' => 'senha',
            'type' => 'password',
            'options' => [
                'label' => 'Senha:'
            ],
            'attributes' => [
                'id' => 'senha',
                'class' => 'form-control',
                'placeholder' => 'Senha do usuário',
                'required' => true
            ]

        ]);
        $this->add([
            'name' => 'submit',
            'type' => 'submit',
            'attributes' => [
                'value' => 'Acessar',
                'id'    => 'btn-login',
                'class' => 'btn btn-lg btn-success'
            ]
        ]);
    }
}

?>