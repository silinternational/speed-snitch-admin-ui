start:
	docker-compose pull
	docker-compose up -d

deps:
	npm install

dist: deps
	npm run build

dev: deps
	npm run serve
	
errors:
	docker-compose logs
	
clean:
	docker-compose kill
	docker system prune -f
	npm run clean
