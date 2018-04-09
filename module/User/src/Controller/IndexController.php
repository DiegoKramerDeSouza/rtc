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
        //return new ViewModel();
        $form = new \User\Form\Add();

        if($this->request->isPost()){
            $form->setData($this->request->getPost());
            
            //Data here
        }

        return new viewModel([
            'form' => $form
        ]);
    }
    
}
