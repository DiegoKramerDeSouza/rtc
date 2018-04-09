<?php
namespace User\Model;
class User
{
    protected $id;
    protected $matricula;
    protected $nome;
    protected $codescola;
    protected $escola;
    protected $senha;
    protected $grupo;
    protected $email;
    
    public function exchangeArray(array $data)
    {
        $this->id = $data['id'];
        $this->name= $data['matricula'];
        $this->name= $data['nome'];
        $this->name= $data['codescola'];
        $this->name= $data['escola'];
        $this->name= $data['senha'];
        $this->name= $data['grupo'];
        $this->email= $data['email'];
    }
    public function getId()
    {
       return $this->id;
    }
    public function getMatricula()
    {
       return $this->matricula;
    }
    public function getNome()
    {
       return $this->nome;
    }
    public function getCodescola()
    {
       return $this->codescola;
    }
    public function getEscola()
    {
       return $this->escola;
    }
    public function getSenha()
    {
       return $this->senha;
    }
    public function getGrupo()
    {
       return $this->grupo;
    }
    public function getEmail()
    {
       return $this->email;
    }
}