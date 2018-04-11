<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace User\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class IndexController extends AbstractActionController
{
    protected $table;
    public function __construct($table)
    {
       $this->table = $table;
    }

    public function indexAction()
    {  
        $users = $this->table->fetchAll();
        return new viewModel([
            'users' => $users
        ]);
    }

    public function addAction()
    {
        //return new ViewModel();
        $form = new \User\Form\UserForm();
        $request = $this->getRequest();

        if(! $request->isPost()){
            //$form->setData($this->request->getPost());
            return new viewModel([
                'form' => $form
            ]);
        } else {
            $user = new \User\Model\User();
            
            $form->setData($request->getPost());

            //if(! $form->isValid()){
                //Retorna mensagem de formulário inválido
            //}

            //Coleta dados do formulário e prepara a inserção no banco
            $user->exchangeArray($form->getData());
            //Salva usuário na base de dados
            $this->table->saveUser($user);

            return $this->redirect()->toRoute('user', [
                'controller'    => 'index',
                'action'        => 'add'
            ]);
        }

        


        
    }
    
}
