<?php
namespace User\Form;

use Zend\Form\Form;

Class UserForm extends Form {
    public function __construct($name = null){
        parent::__construct('user');
        $this->setAttribute('method', 'POST');
        $this->add([
            'name' => 'id',
            'type' => 'hidden',
            'attributes' => [
                'id' => 'id'
            ]
        ]);
        $this->add([
            'name' => 'matricula',
            'type' => 'text',
            'options' => [
                'label' => 'Matrícula:'
            ],
            'attributes' => [
                'id' => 'matricula',
                'class' => 'form-control',
                'placeholder' => 'Matrícula do usuário',
                //'required' => true
            ]

        ]);
        $this->add([
            'name' => 'nome',
            'type' => 'text',
            'options' => [
                'label' => 'Nome:'
            ],
            'attributes' => [
                'id' => 'nome',
                'class' => 'form-control',
                'placeholder' => 'Nome do usuário',
                //'required' => true
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
                //'required' => true
            ]

        ]);
        $this->add([
            'name' => 'confirmsenha',
            'type' => 'password',
            'options' => [
                'label' => 'Confirmar Senha:'
            ],
            'attributes' => [
                'id' => 'confirmsenha',
                'class' => 'form-control',
                'placeholder' => 'Confirme a senha do usuário',
                //'required' => true
            ]

        ]);
        $this->add([
            'name' => 'email',
            'type' => 'text',
            'options' => [
                'label' => 'E-mail:'
            ],
            'attributes' => [
                'id' => 'email',
                'class' => 'form-control',
                'placeholder' => 'E-mail do usuário',
                //'required' => true
            ]

        ]);
        $this->add([
            'name' => 'codescola',
            'type' => 'text',
            'options' => [
                'label' => 'Código da Escola:'
            ],
            'attributes' => [
                'id' => 'codescola',
                'class' => 'form-control',
                'placeholder' => 'Código da escola',
                //'required' => true
            ]

        ]);
        $this->add([
            'name' => 'escola',
            'type' => 'text',
            'options' => [
                'label' => 'Escola:'
            ],
            'attributes' => [
                'id' => 'escola',
                'class' => 'form-control',
                'placeholder' => 'Nome da escola',
                //'required' => true
            ]

        ]);
        $this->add([
            'name' => 'grupo',
            'type' => 'select',
            'options' => [
                'label' => 'Grupo:',
                'empty_option' => 'Escolha o grupo do usuário',
                'value_options' => [
                    '0' => 'Professor',
                    '1' => 'Aluno'
                ]
            ],
            'attributes' => [
                'id' => 'grupo',
                'class' => 'form-control',
                //'required' => true
            ]

        ]);
        $this->add([
            'name' => 'submit',
            'type' => 'submit',
            'attributes' => [
                'value' => 'Salvar usuário',
                'id'    => 'buttonSave',
                'class' => 'btn btn-lg btn-success'
            ]
        ]);
    }
}

?>