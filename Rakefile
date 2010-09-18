require 'rexml/document'
include REXML

EXTENSION_NAME="copyfixer"
BUILD_DIR="build/#{EXTENSION_NAME}"

# here we have a directory task, it will create the
# build directory if it doesn't already exists
directory "#{BUILD_DIR}/chrome"

task :create_buildchrome_dir => ["#{BUILD_DIR}/chrome"]

# we copy the manifest file to the build dir
# then iterate through each line and change the directory references
# to references to the jar file. this allows us to debug/develop normally
# and let the Rakefile deal with the changes necessary for release.
desc "prepare the chrome.manifest file"
file "#{BUILD_DIR}/chrome.manifest" => [:create_buildchrome_dir] do
  open("#{BUILD_DIR}/chrome.manifest",'w') do |infile|
    open("chrome.manifest", "r") do |outfile|
      while line = outfile.gets
        infile.puts line.gsub(/chrome\//, "jar:chrome/#{EXTENSION_NAME}.jar!/")
      end
    end
  end
end

task :create_chrome_manifest => ["#{BUILD_DIR}/chrome.manifest"]

# not much to do here, just copy the install.rdf file over
# to the build dir.
desc "prepare the install.rdf file"
file "#{BUILD_DIR}/install.rdf" => [:create_buildchrome_dir] do
  cp 'install.rdf', "#{BUILD_DIR}/install.rdf"
end

task :create_install_rdf => ["#{BUILD_DIR}/install.rdf"]

# here we create the jar file. ruby does natively support the creation of zip files
# so I have to use the shell to do it. the zip command allows the exclusion of certain file
# and in this case I want to exclude my svn files.
desc "create the chrome jar file"
task :create_chrome_jar => [:create_buildchrome_dir] do
  sh "cd chrome && zip -qr -0 ../#{BUILD_DIR}/chrome/#{EXTENSION_NAME}.jar * -x \*.svn\*"
end

# this task makes sure the we've created the jar, prepared the manifest and install.rdf
# then we zip all of those files. We also extract the extension's version number from
# the install.rdf in order to generate the correct xpi file name.
desc "create the xpi file and use the version number in the file name"
task :create_extension_xpi => [:create_chrome_jar, :create_chrome_manifest, :create_install_rdf] do
  install_rdf_file = File.new('install.rdf','r')
  install_rdf_xmldoc = Document.new(install_rdf_file)
  version_number = ""
  install_rdf_xmldoc.elements.each('RDF/Description/em:version') do |element|
    version_number = element.text
  end

  sh "cd #{BUILD_DIR} && zip -qr -9 ../../#{EXTENSION_NAME}-#{version_number}.xpi *"
  rm_rf "build"
end

task :default => [:create_extension_xpi]