require "tus/server"

map "/audio" do
  run Tus::Server
end

