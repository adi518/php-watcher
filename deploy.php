<?
  // https://stackoverflow.com/questions/4238433/php-how-to-create-a-newline-character
  $sleep = 2;
  echo('Deploy => Start' . PHP_EOL);
  echo("Deploy => Sleep $sleep" . 's' . PHP_EOL);
  sleep($sleep);
  echo('Deploy => Wake up' . PHP_EOL);
  echo ('Deploy => Finish' . PHP_EOL);
?>