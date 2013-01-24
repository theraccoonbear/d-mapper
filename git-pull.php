<?php
header("Content-Type: text/plain");
print "Pulling...\n";

$dir = dirname(__FILE__);

print "<output>" . system("git pull $dir") . "</output>\n";

print "...done.\n";

?>