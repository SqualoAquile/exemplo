<?php
   $menus = [
      [
         "text" => "Home",
         "icon" => "fas fa-tachometer-alt",
         "permissao" => "%",
         "link" => "/home"
      ],
      [
         "text" => "Cadastros",
         "icon" => "fas fa-save",
         "permissao" => "%",
         "link" => "/#",
         "filhos" => [
            [
               "text" => "Clientes",
               "icon" => "fas fa-handshake",
               "permissao" => "clientes_ver",
               "link" => "/clientes"
            ],
            [
               "text" => "Fornecedores",
               "icon" => "fas fa-truck",
               "permissao" => "fornecedores_ver",
               "link" => "/fornecedores"
            ],
            [
               "text" => "Funcionários",
               "icon" => "fas fa-users",
               "permissao" => "funcionarios_ver",
               "link" => "/funcionarios"
            ],
            [
               "text" => "Produtos",
               "icon" => "fas fa-boxes",
               "permissao" => "produtos_ver",
               "link" => "/produtos"
            ],
            [
               "text" => "Serviços",
               "icon" => "fas fa-hammer",
               "permissao" => "produtos_ver",
               "link" => "/produtos"
            ],
            [
               "text" => "Serviços Complementares",
               "icon" => "fas fa-toolbox",
               "permissao" => "produtos_ver",
               "link" => "/produtos"
            ],
         ]
      ],
      [
         "text" => "Financeiro",
         "icon" => "fas fa-money-bill-alt",
         "permissao" => "%",
         "link" => "/#",
         "filhos" => [
            [
               "text" => "Administradoras de Cartão",
               "icon" => "fas fa-credit-card",
               "permissao" => "administradoras_ver",
               "link" => "/administradoras"
            ],
            [
               "text" => "Lançamentos de Caixa",
               "icon" => "fas fa-cart-plus",
               "permissao" => "lancamentos_ver",
               "link" => "/lancamentos"
            ],
            [
               "text" => "Controle de Caixa",
               "icon" => "fas fa-calculator",
               "permissao" => "controlecaixa_ver",
               "link" => "/controlecaixa"
            ],
            [
               "text" => "Controle de Saldos",
               "icon" => "fas fa-chart-line",
               "permissao" => "controlecaixa_ver",
               "link" => "/controlecaixa"
            ]
         ]
      ],
      [
         "text" => "Operações",
         "icon" => "fas fa-business-time",
         "permissao" => "%",
         "link" => "/#",
         "filhos" => [
            [
               "text" => "Orçamentos",
               "icon" => "fas fa-tasks",
               "permissao" => "administradoras_ver",
               "link" => "/administradoras"
            ],
            [
               "text" => "Ordens de Serviço",
               "icon" => "fas fa-file-signature",
               "permissao" => "lancamentos_ver",
               "link" => "/lancamentos"
            ]
         ]
      ],
      [
         "text" => "Relatórios",
         "icon" => "fas fa-table",
         "permissao" => "%",
         "link" => "/#",
         "filhos" => [
            [
               "text" => "Fluxo de Caixa",
               "icon" => "fas fa-chart-line",
               "permissao" => "administradoras_ver",
               "link" => "/administradoras"
            ],
            [
               "text" => "Saldos",
               "icon" => "fas fa-dollar-sign",
               "permissao" => "lancamentos_ver",
               "link" => "/lancamentos"
            ],
            [
               "text" => "Ordens de Serviço",
               "icon" => "fas fa-hands-helping",
               "permissao" => "lancamentos_ver",
               "link" => "/lancamentos"
            ]
         ]
      ],
      [
         "text" => "Configurações",
         "icon" => "fas fa-cogs",
         "permissao" => "%",
         "link" => "/#",
         "filhos" => [
            [
               "text" => "Usuários",
               "icon" => "fas fa-user",
               "permissao" => "usuarios_ver",
               "link" => "/usuarios"
            ],
            [
               "text" => "Permissões",
               "icon" => "fas fa-check-double",
               "permissao" => "permissoes_ver",
               "link" => "/permissoes"
            ],
            [
               "text" => "Parâmetros",
               "icon" => "fas fa-cog",
               "permissao" => "permissoes_ver",
               "link" => "/parametros"
            ],            
         ]
      ]

   ];
?>
<!doctype html>
<html class="h-100">
   <head>
      <title>Painel - <?php echo NOME_EMPRESA;?></title>
      
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

      <link href="<?php echo BASE_URL;?>/assets/css/vendor/jquery-ui.min.css" rel="stylesheet" type="text/css"/>
      
      <link href="<?php echo BASE_URL;?>/assets/css/style.css" rel="stylesheet" type="text/css"/>

      <script src="<?php echo BASE_URL;?>/assets/js/vendor/jquery-3.3.1.min.js" type="text/javascript"></script>
      <script src="<?php echo BASE_URL;?>/assets/js/vendor/jquery.mask.js" type="text/javascript"></script>
      <script src="<?php echo BASE_URL;?>/assets/js/vendor/jquery.dataTables.min.js" type="text/javascript"></script>
      <script src="<?php echo BASE_URL;?>/assets/js/vendor/jquery-ui.min.js" type="text/javascript"></script>
      <script src="<?php echo BASE_URL;?>/assets/js/vendor/popper.min.js" type="text/javascript"></script>
      <script src="<?php echo BASE_URL;?>/assets/js/vendor/bootstrap.min.js" type="text/javascript"></script>
      <script src="<?php echo BASE_URL;?>/assets/js/vendor/jquery.highlight.js" type="text/javascript"></script>
      <script src="<?php echo BASE_URL;?>/assets/js/vendor/dataTables.searchHighlight.min.js" type="text/javascript"></script>

      <script src="<?php echo BASE_URL;?>/assets/js/validacoes.js" type="text/javascript"></script>
      <script src="<?php echo BASE_URL;?>/assets/js/principal.js" type="text/javascript"></script>
   </head>
<body class="d-flex flex-column h-100 bg-light">
   <nav class="navbar bg-white shadow-sm fixed-top">
      <ul class="nav">
         <li>
            <button class="btn btn-link px-0 border-0" id="menu-toggle">
               <i class="fas fa-bars"></i>
            </button>
         </li>
         <li> <!--Nome da Empresa-->
            <a class="navbar-brand mx-3" href="<?php echo BASE_URL ?>/home"><?php echo trim(NOME_EMPRESA);?></a>
         </li>
      </ul>
      <ul class="navbar-nav">
         <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
               <span>Olá, </span>
               <span><?php echo ucfirst($infoUser["nomeUsuario"]);?></span>
            </a>
            <div class="dropdown-menu dropdown-menu-right position-absolute" aria-labelledby="navbarDropdown">
               <a class="dropdown-item" onclick="return confirm('Confirmar sua saída?')" href="<?php echo BASE_URL;?>/login/sair">Sair</a>
            </div>
         </li>
      </ul>
   </nav>
   <div id="wrapper">
      <aside id="sidebar-wrapper" class="shadow-lg bg-white">
         <ul class="nav flex-column sidebar-nav py-3">
            <?php foreach ($menus as $key => $value): ?> <!--Verifica se o funcionario tem permissao, do contrário nem exibe os módulos-->
               <?php if($value["permissao"] == "%" || in_array($value["permissao"], $infoUser["permissoesUsuario"])): ?>
                  <?php
                     // Menu com Dropdown
                     // Monta o HTML através do PHP, exibindo os sub-itens (exemplo: Cadastros-> Clientes, Fornecedores, etc)
                     if (isset($value["filhos"])) {
                        
                        $filhos = "";
                        foreach ($value["filhos"] as $keyFilho => $valueFilho) {
                           if(in_array($valueFilho['permissao'],$infoUser["permissoesUsuario"])){
                              $filhos .= '
                                 <li class="nav-item">
                                    <a class="nav-link my-2" href="' . BASE_URL . $valueFilho["link"] . '">
                                       <i class="' . $valueFilho["icon"] . ' mr-2"></i>
                                       <span>' . $valueFilho["text"] . '</span>
                                    </a>
                                 </li>
                              ';
                           }
                        }

                        $navItemDropdownClass = "dropdown position-static";
                        $navLinkDropdownClass = "dropdown-toggle";
                        $navLinkDropdownAttrs = 'data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"';
                        $dropdownMenu = '
                           <ul class="dropdown-menu float-none border-0 rounded-0 position-static mt-0 py-0 px-3">' . $filhos . '</ul>
                        ';
                     } else {
                        $navItemDropdownClass = "";
                        $navLinkDropdownClass = "";
                        $navLinkDropdownAttrs = "";
                        $dropdownMenu = "";
                     }
                  ?>
                  <li class="nav-item <?php echo $navItemDropdownClass ?>">
                     <a class="nav-link my-2 <?php echo $navLinkDropdownClass ?>" href="<?php echo BASE_URL . $value["link"] ?>" <?php echo $navLinkDropdownAttrs ?>>
                        <i class="<?php echo $value["icon"] ?> mr-2"></i>
                        <span><?php echo $value["text"] ?></span>
                     </a>
                     <?php echo $dropdownMenu ?>
                  </li>
               <?php endif ?>
            <?php endforeach ?>
         </ul>
      </aside>
      <main id="page-content-wrapper">
         <?php include "_breadcrumb.php" ?>
         <div class="container-fluid">
            <?php $this->loadViewInTemplate($viewName, $viewData); ?>
         </div>
      </main>
      </div>
      <footer class="py-3 bg-white mt-auto shadow-sm">
         <div class="container-fluid">
            <div class="text-muted text-center small">Todos os direitos reservados <strong>Aquarium</strong><br/>Estamos à disposição: <a href="mailto:contato@squaloaquile.com.br" class="text-muted font-italic">contato@squaloaquile.com.br</a></div>
         </div>
      </footer>
   </body> 
</html>