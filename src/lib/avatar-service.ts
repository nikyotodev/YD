interface AvatarData {
  name: string;
  url: string;
}

// Список всех доступных аватарок с GitHub
const AVATARS: AvatarData[] = [
  { name: "Adam Crowley", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAdam%20Crowley.jpg" },
  { name: "Adriano Alfaro", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAdriano%20Alfaro.jpg" },
  { name: "Aiman Fernandez", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAiman%20Fernandez.jpg" },
  { name: "Ajani Kimathi", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAjani%20Kimathi.jpg" },
  { name: "Akalan Demir", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAkalan%20Demir.jpg" },
  { name: "Alan Everette", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAlan%20Everette.jpg" },
  { name: "Alana Devrow", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAlana%20Devrow.jpg" },
  { name: "Alex Gerard-Morin", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAlex%20Gerard-Morin.jpg" },
  { name: "Alex Goodwin", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAlex%20Goodwin.jpg" },
  { name: "Alexandra Mccann", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAlexandra%20Mccann.jpg" },
  { name: "Alix Benoit", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAlix%20Benoit.jpg" },
  { name: "Allie Goldman", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAllie%20Goldman.jpg" },
  { name: "Allie Schumm", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAllie%20Schumm.jpg" },
  { name: "Amber Mcginnis", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAmber%20Mcginnis.jpg" },
  { name: "Amy Hansen", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAmy%20Hansen.jpg" },
  { name: "Amy-Louise Klein", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAmy-Louise%20Klein.jpg" },
  { name: "Andols Hamrick", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAndols%20Hamrick.jpg" },
  { name: "Angela Bennet", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAngela%20Bennet.jpg" },
  { name: "April Li", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DApril%20Li.jpg" },
  { name: "Ariya Goulding", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAriya%20Goulding.jpg" },
  { name: "Aryan Byers", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAryan%20Byers.jpg" },
  { name: "Ashley White", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAshley%20White.jpg" },
  { name: "Aubrey De León", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAubrey%20De%20Le%C3%B3n.jpg" },
  { name: "Aurélie Moreau", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAur%C3%A9lie%20Moreau.jpg" },
  { name: "Austin Marshall", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAustin%20Marshall.jpg" },
  { name: "Avery Magana", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DAvery%20Magana.jpg" },
  { name: "Bella Huffman", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DBella%20Huffman.jpg" },
  { name: "Ben Tofan", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DBen%20Tofan.jpg" },
  { name: "Bradlee Goff", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DBradlee%20Goff.jpg" },
  { name: "Bradley Hill", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DBradley%20Hill.jpg" },
  { name: "Brian Tucker", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DBrian%20Tucker.jpg" },
  { name: "Brianna Roy", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DBrianna%20Roy.jpg" },
  { name: "Brittany Walsh", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DBrittany%20Walsh.jpg" },
  { name: "Brittney Allen", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DBrittney%20Allen.jpg" },
  { name: "Brooke Weaver", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DBrooke%20Weaver.jpg" },
  { name: "Bruce Dixon", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DBruce%20Dixon.jpg" },
  { name: "Cameron Hale", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DCameron%20Hale.jpg" },
  { name: "Caolan Morgan", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DCaolan%20Morgan.jpg" },
  { name: "Chloe Hayes", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DChloe%20Hayes.jpg" },
  { name: "Christoper Casteel", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DChristoper%20Casteel.jpg" },
  { name: "Clark Spencer", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DClark%20Spencer.jpg" },
  { name: "Collin Ferris", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DCollin%20Ferris.jpg" },
  { name: "Cynthia Johnson", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DCynthia%20Johnson.jpg" },
  { name: "Darcy Hooper", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DDarcy%20Hooper.jpg" },
  { name: "Daria Armani", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DDaria%20Armani.jpg" },
  { name: "Darron Hughey", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DDarron%20Hughey.jpg" },
  { name: "David Franco", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DDavid%20Franco.jpg" },
  { name: "David Nguyen", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DDavid%20Nguyen.jpg" },
  { name: "Dillan Preece", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DDillan%20Preece.jpg" },
  { name: "Dobry Semenov", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DDobry%20Semenov.jpg" },
  { name: "Drew Hutton", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DDrew%20Hutton.jpg" },
  { name: "Duncan Bentley", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DDuncan%20Bentley.jpg" },
  { name: "Edward Sullivan", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DEdward%20Sullivan.jpg" },
  { name: "Elise Hunt", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DElise%20Hunt.jpg" },
  { name: "Ella White", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DElla%20White.jpg" },
  { name: "Elliot Graf", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DElliot%20Graf.jpg" },
  { name: "Elliot Park", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DElliot%20Park.jpg" },
  { name: "Emily Tate", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DEmily%20Tate.jpg" },
  { name: "Eren Fleming", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DEren%20Fleming.jpg" },
  { name: "Eric Colwell", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DEric%20Colwell.jpg" },
  { name: "Eric Sherman", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DEric%20Sherman.jpg" },
  { name: "Eric Smith", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DEric%20Smith.jpg" },
  { name: "Erick Pires", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DErick%20Pires.jpg" },
  { name: "Francisco Cardoso", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DFrancisco%20Cardoso.jpg" },
  { name: "Han Noguchi", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DHan%20Noguchi.jpg" },
  { name: "Hannah Zhao", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DHannah%20Zhao.jpg" },
  { name: "Holly Maldano", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DHolly%20Maldano.jpg" },
  { name: "India Blake", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DIndia%20Blake.jpg" },
  { name: "Jasmine Ellis", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DJasmine%20Ellis.jpg" },
  { name: "Jason Barr", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DJason%20Barr.jpg" },
  { name: "Jeannine Millet", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DJeannine%20Millet.jpg" },
  { name: "Jens Röhrdanz", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DJens%20R%C3%B6hrdanz.jpg" },
  { name: "Jeremy Price", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DJeremy%20Price.jpg" },
  { name: "Jermaine Hall", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DJermaine%20Hall.jpg" },
  { name: "Jessica Aldanondo", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DJessica%20Aldanondo.jpg" },
  { name: "Jessie Lake", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DJessie%20Lake.jpg" },
  { name: "Joe Bautista", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DJoe%20Bautista.jpg" },
  { name: "Jonah Levin", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DJonah%20Levin.jpg" },
  { name: "Kaitlyn Franco", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DKaitlyn%20Franco.jpg" },
  { name: "Kathryn Mathis", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DKathryn%20Mathis.jpg" },
  { name: "Kevin Aldano", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DKevin%20Aldano.jpg" },
  { name: "Kris Rollins", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DKris%20Rollins.jpg" },
  { name: "Kristine Davis", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DKristine%20Davis.jpg" },
  { name: "Kyan Coleman", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DKyan%20Coleman.jpg" },
  { name: "Lawerence Vogt", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DLawerence%20Vogt.jpg" },
  { name: "Leila Walker", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DLeila%20Walker.jpg" },
  { name: "Leslie Hughes", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DLeslie%20Hughes.jpg" },
  { name: "Lianne Hines", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DLianne%20Hines.jpg" },
  { name: "Linda Cain", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DLinda%20Cain.jpg" },
  { name: "Lisa Washington", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DLisa%20Washington.jpg" },
  { name: "Liza Rezende", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DLiza%20Rezende.jpg" },
  { name: "Lori Stanley", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DLori%20Stanley.jpg" },
  { name: "Luc Bernier", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DLuc%20Bernier.jpg" },
  { name: "Luca Dimitrov", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DLuca%20Dimitrov.jpg" },
  { name: "Luciano Gantt", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DLuciano%20Gantt.jpg" },
  { name: "Maddox Blake", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DMaddox%20Blake.jpg" },
  { name: "Magrit Stiffel", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DMagrit%20Stiffel.jpg" },
  { name: "Marcus King", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DMarcus%20King.jpg" },
  { name: "Matthew Nolter", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DMatthew%20Nolter.jpg" },
  { name: "Melissa Ribeiro", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DMelissa%20Ribeiro.jpg" },
  { name: "Michael Cullen", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DMichael%20Cullen.jpg" },
  { name: "Molly Vinson", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DMolly%20Vinson.jpg" },
  { name: "Nadine Shah", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DNadine%20Shah.jpg" },
  { name: "Nathan Azevedo", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DNathan%20Azevedo.jpg" },
  { name: "Nathan Mora", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DNathan%20Mora.jpg" },
  { name: "Nino Endrizzi", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DNino%20Endrizzi.jpg" },
  { name: "Nojus Hutton", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DNojus%20Hutton.jpg" },
  { name: "Nolan Howe", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DNolan%20Howe.jpg" },
  { name: "Olivia Grant", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DOlivia%20Grant.jpg" },
  { name: "Omari Norris", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DOmari%20Norris.jpg" },
  { name: "Paul Brown", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DPaul%20Brown.jpg" },
  { name: "Paula Harris", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DPaula%20Harris.jpg" },
  { name: "Polina Kranz", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DPolina%20Kranz.jpg" },
  { name: "Rachel Reinhardt", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DRachel%20Reinhardt.jpg" },
  { name: "Rajan Hansen", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DRajan%20Hansen.jpg" },
  { name: "Raquel Barros", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DRaquel%20Barros.jpg" },
  { name: "Rebecca Connor", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DRebecca%20Connor.jpg" },
  { name: "Roland Bourdon", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DRoland%20Bourdon.jpg" },
  { name: "Shannon Adams", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DShannon%20Adams.jpg" },
  { name: "Shelly Dorsey", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DShelly%20Dorsey.jpg" },
  { name: "Sherri Matthews", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DSherri%20Matthews.jpg" },
  { name: "Sophie Azevedo", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DSophie%20Azevedo.jpg" },
  { name: "Stefan Jokiel", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DStefan%20Jokiel.jpg" },
  { name: "Stephanie Harris", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DStephanie%20Harris.jpg" },
  { name: "Stephanie Mora", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DStephanie%20Mora.jpg" },
  { name: "Sue Xióng", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DSue%20Xi%C3%B3ng.jpg" },
  { name: "Sydney Jimenez", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DSydney%20Jimenez.jpg" },
  { name: "Tam Seiko", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DTam%20Seiko.jpg" },
  { name: "Tayler Reese", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DTayler%20Reese.jpg" },
  { name: "Teo Baird", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DTeo%20Baird.jpg" },
  { name: "Thomas Stone", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DThomas%20Stone.jpg" },
  { name: "Tobias Jurgen", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DTobias%20Jurgen.jpg" },
  { name: "Toby Bielak", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DToby%20Bielak.jpg" },
  { name: "Tom Gallagher", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DTom%20Gallagher.jpg" },
  { name: "Tory Elston", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DTory%20Elston.jpg" },
  { name: "Travis Povey", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DTravis%20Povey.jpg" },
  { name: "Vance Keck", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DVance%20Keck.jpg" },
  { name: "Wojtek Słowiński", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DWojtek%20S%C5%82owi%C5%84ski.jpg" },
  { name: "Yuan Cho", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DYuan%20Cho.jpg" },
  { name: "Zidan Ahmed", url: "https://raw.githubusercontent.com/nikyotodev/avatars-for-free/main/Shape%3DRound%2C%20Person%3DZidan%20Ahmed.jpg" }
];

// Кэш использованных аватарок для сессии
const sessionAvatarCache = new Map<string, AvatarData>();

/**
 * Получить случайную аватарку для AI-собеседника
 */
function getRandomAvatar(): AvatarData {
  const randomIndex = Math.floor(Math.random() * AVATARS.length);
  return AVATARS[randomIndex];
}

/**
 * Получить аватарку для конкретной сессии (консистентная в рамках диалога)
 */
function getAvatarForSession(sessionId: string): AvatarData {
  if (!sessionAvatarCache.has(sessionId)) {
    const avatar = getRandomAvatar();
    sessionAvatarCache.set(sessionId, avatar);
    return avatar;
  }
  const cachedAvatar = sessionAvatarCache.get(sessionId);
  if (!cachedAvatar) {
    throw new Error("Avatar not found in cache");
  }
  return cachedAvatar;
}

/**
 * Получить аватарку по имени
 */
function getAvatarByName(name: string): AvatarData | null {
  return AVATARS.find(avatar => avatar.name === name) || null;
}

/**
 * Получить список всех доступных аватарок
 */
function getAllAvatars(): AvatarData[] {
  return [...AVATARS];
}

/**
 * Получить случайную группу аватарок (для выбора тренера)
 */
function getRandomAvatarGroup(count = 3): AvatarData[] {
  const shuffled = [...AVATARS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Очистить кэш аватарок (при завершении сессии)
 */
function clearSessionCache(sessionId?: string): void {
  if (sessionId) {
    sessionAvatarCache.delete(sessionId);
  } else {
    sessionAvatarCache.clear();
  }
}

/**
 * Преобразовать имя в более дружелюбный формат
 */
function formatName(name: string): string {
  return name.split(' ')[0]; // Берем только первое имя
}

/**
 * Получить аватарку с фоллбэком
 */
function getAvatarWithFallback(sessionId: string): { url: string; name: string; alt: string } {
  try {
    const avatar = getAvatarForSession(sessionId);
    return {
      url: avatar.url,
      name: formatName(avatar.name),
      alt: `Аватар ${avatar.name}`
    };
  } catch (error) {
    // Фоллбэк на случай ошибки
    return {
      url: AVATARS[0].url,
      name: formatName(AVATARS[0].name),
      alt: "Аватар преподавателя"
    };
  }
}

const AvatarService = {
  getRandomAvatar,
  getAvatarForSession,
  getAvatarByName,
  getAllAvatars,
  getRandomAvatarGroup,
  clearSessionCache,
  formatName,
  getAvatarWithFallback,
};

export { AvatarService, type AvatarData };
