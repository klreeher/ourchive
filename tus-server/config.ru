require "tus/server"

map "/files" do
  run Tus::Server
end

