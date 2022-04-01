cd\
cd "C:\Program Files\MongoDB\Tools\100\bin"

mongoimport -h 127.0.0.1:27017 -d followme -c weapons --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\weapons.csv" --headerline --type csv --drop


mongoimport -h 127.0.0.1:27017  -d followme -c levelSelectImagesDefinition --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\0_checkpoint.csv" --headerline --type csv --drop

mongoimport -h 127.0.0.1:27017  -d followme -c levelSelectImagesDefinition --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\0_items.csv" --headerline --type csv

mongoimport -h 127.0.0.1:27017  -d followme -c levelSelectImagesDefinition --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\0_surface.csv" --headerline --type csv

mongoimport -h 127.0.0.1:27017  -d followme -c levelSelectImagesDefinition --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\0_teleports.csv" --headerline --type csv

mongoimport -h 127.0.0.1:27017  -d followme -c levelSelectImagesDefinition --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\0_fans.csv" --headerline --type csv


mongoimport -h 127.0.0.1:27017  -d followme -c youllKnowWhatToDoImagesDefinition --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\1_surface.csv" --headerline --type csv --drop

mongoimport -h 127.0.0.1:27017  -d followme -c youllKnowWhatToDoImagesDefinition --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\1_caves.csv" --headerline --type csv

mongoimport -h 127.0.0.1:27017  -d followme -c youllKnowWhatToDoImagesDefinition --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\1_checkpoint.csv" --headerline --type csv

mongoimport -h 127.0.0.1:27017  -d followme -c youllKnowWhatToDoImagesDefinition --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\1_enemies.csv" --headerline --type csv



mongoimport -h 127.0.0.1:27017  -d followme -c theEnemiesAreComingImagesDefinition --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\2_caves.csv" --drop --headerline --type csv

mongoimport -h 127.0.0.1:27017  -d followme -c theEnemiesAreComingImagesDefinition --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\2_enemies.csv" --headerline --type csv

mongoimport -h 127.0.0.1:27017  -d followme -c theEnemiesAreComingImagesDefinition --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\2_checkpoint.csv" --headerline --type csv

mongoimport -h 127.0.0.1:27017  -d followme -c theEnemiesAreComingImagesDefinition --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\2_surface.csv" --headerline --type csv


mongoimport -h 127.0.0.1:27017  -d followme -c levelList --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\levelList.csv" --headerline --type csv --drop

mongoimport -h 127.0.0.1:27017  -d followme -c statsToRank --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\statsToRank.csv" --headerline --type csv --drop

mongoimport -h 127.0.0.1:27017  -d followme -c xpStats --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\xpStats.csv" --headerline --type csv --drop

mongoimport -h 127.0.0.1:27017  -d followme -c xpToRank --file "C:\Users\Vincent.Norris\workspace\personal\followMe2\mDB files\xpToRank.csv" --headerline --type csv --drop
