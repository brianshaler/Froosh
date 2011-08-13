<?

if (strtolower(substr($_SERVER["SERVER_NAME"], 0, 4)) == "www.")
{
  header("Location: http://" . substr($_SERVER["SERVER_NAME"], 4) . "/");
  exit;
}

echo "Welcome to ".$_SERVER["SERVER_NAME"]."!";

?>