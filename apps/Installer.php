<?php

/**
 * Installer class for initializing plugin components.
 *
 * @package QuickCartShopping
 */
namespace QuickCartShopping;

use QuickCartShopping\Admin\Menu;
use QuickCartShopping\Cart\CartPosition;
use QuickCartShopping\Assets;
use QuickCartShopping\Api\Api;


      /**
 * Plugin Functions Installer Class
 */
class Installer{

    public function __construct()
    {
      Menu::instance();
      Assets::instance();
      CartPosition::instance();
      Api::instance();

    }

}