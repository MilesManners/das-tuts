require_relative "../runner.rb"

describe "some examples" do
  it "can pass" do
    (1 + 1).should == 2
  end

  it "can fail" do
    (1 + 1).should == 3
  end

  it "can pass after failing" do
  end
end
