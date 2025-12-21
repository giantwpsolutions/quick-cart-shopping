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
use QuickCartShopping\FrontEnd\FrontEnd_Assets;
use QuickCartShopping\FrontEnd\CartToggleRenderer;
use QuickCartShopping\FrontEnd\SettingsProvider;
use QuickCartShopping\FrontEnd\CartHandler;


      /**
 * Plugin Functions Installer Class
 */
class Installer{

    public function __construct()
    {
      Menu::instance();
      Assets::instance();
      Api::instance();
      SettingsProvider::instance();
      FrontEnd_Assets::instance();
      CartToggleRenderer::instance();
      CartHandler::instance();

    }

}