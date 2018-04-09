<?php
namespace User\Model;
use Zend\Db\TableGateway\TableGatewayInterface;
class UserTable
{
    protected $tableGateway;
    public function __construct(TableGatewayInterface $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }
    public function fetchAll()
    {
        return $this->tableGateway->select();
    }
    public function saveUser(User $user)
    {
        $data = [
          'matricula' => $user->getMatricula(),
          'nome' => $user->getNome(),
          'codescola' => $user->getCodescola(),
          'escola' => $user->getEscola(),
          'senha' => $user->getSenha(),
          'grupo' => $user->getGrupo(),
          'email' => $user->getEmail()
        ];
        $this->tableGateway->insert($data);
    }
}