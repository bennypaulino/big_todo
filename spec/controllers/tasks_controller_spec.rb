require 'rails_helper'

RSpec.describe TasksController, type: :controller do
  describe "tasks#index" do
    it "should list the tasks in the database" do
      task1 = FactoryGirl.create(:task)
      task2 = FactoryGirl.create(:task)
      task1.update_attributes(title: "Popcorn")
      get :index
      expect(response).to have_http_status :success
      response_value = ActiveSupport::JSON.decode(@response.body)
      expect(response_value.count).to eq(2)
      response_ids = response_value.collect do |task|
        task["id"]
      end
      expect(response_ids).to eq([task1.id, task2.id])
    end
  end

  describe "tasks#update" do
    it "should allow tasks to be marked as done" do
      task = FactoryGirl.create(:task, done: false, in_progress: false)
      put :update, id: task.id, task: { done: true }
      expect(response).to have_http_status(:success)
      task.reload
      expect(task.done).to eq(true)
      expect(task.in_progress).to eq(false)
    end

    it "should allow tasks to be marked as in progress" do
      task = FactoryGirl.create(:task, done: false, in_progress: true)
      put :update, id: task.id, task: { in_progress: true }
      expect(response).to have_http_status(:success)
      task.reload
      expect(task.in_progress).to eq(true)
      expect(task.done).to eq(false)
    end
  end

  describe "tasks#create" do
    it "should allow new tasks to be created" do
      post :create, task: {title: "Go for a walk"}
      expect(response).to have_http_status(:success)
      # Expect response body to be a JSON representation of the task.
      # Parse response as JSON and ensure the title has been populated
      # in spec/controllers/tasks_controller_spec.rb
      response_value = ActiveSupport::JSON.decode(@response.body)
      expect(response_value['title']).to eq("Go for a walk")
      # Ensure that the item has been stored into the database.
      expect(Task.last.title).to eq("Go for a walk")
    end
  end
end
